<?php

class Silktide
{
    /**
     * Default notification URL
     */
    const DEFAULT_NOTIFY_URL = 'https://api.silktide.com/cms/update';

    /**
     * Our minimum WordPress version
     */
    const MINIMUM_WORDPRESS_VERSION = '4.9.8';

    /**
     * The notification URL we should use.
     *
     * @var string
     */
    private $silktide_notify_url;

    /**
     * Our plugin version.
     */
    private $plugin_version;

    public function __construct()
    {
        $this->silktide_notify_url = self::DEFAULT_NOTIFY_URL;
        if (defined('SILKTIDE_NOTIFY_URL')) {
            $this->silktide_notify_url = SILKTIDE_NOTIFY_URL;
        }
        $plugin_data = get_file_data(__DIR__ . DIRECTORY_SEPARATOR . 'silktide.php',
            array('Version' => 'Version'), false);
        $this->plugin_version = $plugin_data['Version'];
        if (is_admin()) {
            add_action('admin_init', array($this, 'action_register_settings'));
            add_filter(
                'plugin_action_links_' . plugin_basename(plugin_dir_path(__FILE__) . 'silktide.php'),
                array($this, 'admin_plugin_settings_link')
            );
            add_action('admin_menu', array($this, 'action_config_page'));
            $current_version = get_option('silktide_version');
            if (false === $current_version || version_compare($this->plugin_version, $current_version) > 0) {
                update_option('silktide_version', $this->plugin_version);
            }
        }
        add_action('transition_post_status', array($this, 'action_hook_transitioned'), 10, 3);
        add_action('silktide_header', array($this, 'action_hook_header'));
        add_action('wp_head', array($this, 'action_hook_header'));
    }

    /**
     * Add an admin page link.
     *
     * @param array $links
     * @return array
     */
    public function admin_plugin_settings_link($links)
    {
        return array_merge(
            $links,
            array(
                '<a href="' . admin_url('options-general.php?page=silktide') . '">' . __('Settings',
                    'silktide') . '</a>'
            )
        );
    }

    /**
     * Add our Silktide meta header.
     * This tells Silktide what it needs to edit the page later on.
     */
    public function action_hook_header()
    {
        /**
         * The post entity.
         *
         * @var WP_Post $post
         */
        global $post;

        /**
         * 404 pages don't define a $post; we can't edit these, so we ignore them
         */
        if (!isset($post) || !$post) {
            return;
        }

        $key = get_option('silktide_api_key', '');
        if (strlen($key) < 32) {
            return;
        }

        $post_type_object = get_post_type_object($post->post_type);
        if (!$post_type_object) {
            return;
        }
        if ($post_type_object->_edit_link) {
            $edit_link = admin_url(sprintf($post_type_object->_edit_link . '&action=edit', $post->ID));
        } else {
            return admin_url();
        }

        $ivlen = openssl_cipher_iv_length('AES-256-CBC');

        /**
         * We don't check the cryptographically strong flag as it's not vitally important.
         */
        $iv = openssl_random_pseudo_bytes($ivlen);
        if (false === $iv) {
            return;
        }

        $ciphertext_raw = openssl_encrypt(
            wp_json_encode(array('editorUrl' => $edit_link)),
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            $iv);
        $hmac = hash_hmac('sha256', $ciphertext_raw, $key, true);
        $ciphertext = base64_encode($iv . $hmac . $ciphertext_raw);

        echo '<meta name="silktide-cms" content="' . esc_attr($ciphertext) . '" />' . PHP_EOL;
    }

    /**
     * Fire a callback.
     *
     * @param string  $new_status New post status.
     * @param string  $old_status Old post status.
     * @param WP_Post $post       Post object.
     */
    public function action_hook_transitioned($new_status, $old_status, $post)
    {
        /**
         * Only interested in published posts.
         */
        if ($new_status !== 'publish') {
            return;

        }
        $this->send_to_silktide(get_permalink($post->ID));
    }

    /**
     * Send the notification to Silktide.
     *
     * @param string $url Public URL of the page.
     */
    private function send_to_silktide($url)
    {
        global $wp_version;
        $key = get_option('silktide_api_key', '');
        if (strlen($key) < 32) {
            return;
        }
        $user_agent = 'SilktideWordPress/' . $this->plugin_version . ' (compatible; WordPress ' . $wp_version . ')';
        update_option(
            'silktide_last_notified',
            wp_json_encode(
                array(
                    'time' => time(),
                    'url' => $url,
                    'notifyUrl' => $this->silktide_notify_url,
                    'result' => 'pending'
                )
            )
        );
        $body = http_build_query(
            array(
                'apiKey' => $key,
                'urls' => array($url)
            )
        );
        $result = wp_remote_post(
            $this->silktide_notify_url,
            array(
                'method' => 'POST',
                'user-agent' => $user_agent,
                'blocking' => true,
                'compress' => true,
                'body' => $body
            )
        );
        if (is_wp_error($result)) {
            update_option(
                'silktide_last_notified',
                wp_json_encode(
                    array(
                        'time' => time(),
                        'url' => $url,
                        'notifyUrl' => $this->silktide_notify_url,
                        'result' => 'Error: ' . $result->get_error_message()
                    )
                )
            );

            return;
        }
        if (200 === (int)$result['response']['code']) {
            $decoded = json_decode($result['body'], true);
            if (is_array($decoded) && isset($decoded['status']) && 'ok' === $decoded['status']) {
                update_option(
                    'silktide_last_notified',
                    wp_json_encode(
                        array(
                            'time' => time(),
                            'url' => $url,
                            'notifyUrl' => $this->silktide_notify_url,
                            'result' => 'Success: ' . $result['body']
                        )
                    )
                );

                return;
            }
        }
        update_option(
            'silktide_last_notified',
            wp_json_encode(
                array(
                    'time' => time(),
                    'url' => $url,
                    'notifyUrl' => $this->silktide_notify_url,
                    'result' => 'Failed: ' . $result['response']['code'] . ' - ' . $result['body']
                )
            )
        );
    }

    /**
     * Used by init.
     */
    public function action_config_page()
    {
        add_submenu_page(
            'options-general.php', // parent_slug.
            __('Silktide configuration', 'silktide'), // page_title.
            __('Silktide', 'silktide'), // menu title.
            'manage_options', // capability.
            'silktide', // menu slug.
            array($this, 'hook_config_page')
        );
    }

    /**
     * Register the settings.
     */
    public function action_register_settings()
    {
        register_setting(
            'silktide_options', // option group.
            'silktide_api_key', // option name.
            array(
                'type' => 'string',
                'description' => __('Silktide API key', 'silktide'),
                'sanitize_callback' => array($this, 'hook_options_validate_apikey'),
                'show_in_rest' => false,
                'default' => ''
            )
        );
        add_settings_section(
            'silktide_key', // id.
            '', // title.
            '', // callback.
            'silktide' // page.
        );
        add_settings_field(
            'silktide_api_key', // id.
            '<label for="silktide_api_key">' . __('API Key', 'silktide') . '</label>', // label.
            array($this, 'action_register_settings_api_key_field'), // callback.
            'silktide', // page.
            'silktide_key'  // section.
        );
    }

    /**
     * Validate the admin options.
     *
     * @param string $input The api key as entered.
     * @return string
     */
    public function hook_options_validate_apikey($input)
    {
        $input = trim($input);
        if (preg_match('/^[a-z0-9:\-]{32,64}$/i', $input)) {
            return $input;
        }
        add_settings_error(
            'silktide_options',
            esc_attr('settings_updated'),
            __('Sorry, that API key was invalid. It must be an API key from Silktide.com', 'silktide'),
            'error'
        );

        return '';
    }

    /**
     * Show the options.
     */
    public function action_register_settings_api_key_field()
    {
        $option = get_option('silktide_api_key', '');
        echo '<input type="text" id="silktide_api_key" name="silktide_api_key" size="64" maxlength="64" required ';
        echo 'pattern="^[a-zA-Z0-9:\-]{32,64}$" ';
        echo 'title="';
        echo esc_attr__('Please enter the API key as provided by Silktide', 'silktide');
        echo '" ';
        echo 'value="' . esc_attr($option) . '"><br>';
    }

    /**
     * Show the configuration page.
     */
    public function hook_config_page()
    {
        ?>
        <div>
            <h2><?php esc_html_e('Silktide configuration', 'silktide'); ?></h2>
            <?php echo sprintf(
                wp_kses(__(
                    'Please see the <a href="%s">configuration guide</a> or contact ' .
                    '<a href="%s">Silktide</a> for assistance.',
                    'silktide'),
                    array(
                        'a' => array('href' => array())
                    )
                ),
                esc_url('https://support.silktide.com/guides/cms-integrations/how-to-integrate-silktide-with-wordpress/'),
                esc_url('https://silktide.com/')
            );
            ?>
            <form action="options.php" method="post">
                <?php settings_fields('silktide_options'); ?>
                <?php do_settings_sections('silktide'); ?>

                <?php submit_button(); ?>
            </form>
            <?php
            if (isset($_GET['debug'])) {
                $this->showDebug();

            }
            ?>
        </div>
        <?php
    }

    /**
     * Show the debug information.
     */
    private function showDebug()
    {
        $option = get_option('silktide_last_notified');
        if (false === $option) {
            esc_html_e('No notifications sent', 'silktide');

            return;
        }
        $previous = json_decode($option, true);
        if (!is_array($previous)) {
            esc_html_e('Invalid notification log - unable to decode', 'silktide');

            return;
        }
        if (!isset($previous['time'], $previous['url'], $previous['notifyUrl'], $previous['result'])) {
            esc_html_e('Invalid notification long - missing data', 'silktide');

            return;
        }
        ?>
        <h3>
            <?php
            esc_html_e('Last notification log', 'silktide');
            ?>
        </h3>
        <table style="border:solid black 1px;">
            <tr>
                <th>
                    <?php
                    esc_html_e('Notification time', 'silktide');
                    ?>
                </th>
                <td>
                    <?php
                    $time = date('Y-m-d H:i:s', $previous['time']);
                    print sprintf('%s', esc_html($time));
                    ?>
                </td>
            </tr>
            <tr>
                <th>
                    <?php
                    esc_html_e('Sent to', 'silktide');
                    ?>
                </th>
                <td>
                    <?php
                    print sprintf('%s', esc_html($previous['notifyUrl']));
                    ?>
                </td>
            </tr>
            <tr>
                <th>
                    <?php
                    esc_html_e('About', 'silktide');
                    ?>
                </th>
                <td>
                    <?php
                    print sprintf('%s', esc_html($previous['url']));
                    ?>
                </td>
            </tr>
            <tr>
                <th>
                    <?php
                    esc_html_e('Result', 'silktide');
                    ?>
                </th>
                <td>
                    <?php
                    print sprintf('%s', esc_html($previous['result']));
                    ?>
                </td>
            </tr>
        </table>
        <?php
    }

    /**
     * Used by init.
     */
    public function hook_plugin_activation()
    {
        if (version_compare($GLOBALS['wp_version'], self::MINIMUM_WORDPRESS_VERSION, '<')) {
            /* translators: %s is the minimum WordPress version supported.  */
            $message = sprintf(__('Sorry, Silktide requires WordPress version %s or later.', 'silktide'),
                self::MINIMUM_WORDPRESS_VERSION);
            wp_die(esc_html($message));
            exit();
        }
        /**
         * Check all our OpenSSL functions are available.
         */
        if (!function_exists('openssl_encrypt') ||
            !function_exists('openssl_random_pseudo_bytes') ||
            !function_exists('openssl_cipher_iv_length')
        ) {
            $message = sprintf(__('Sorry, Silktide requires the OpenSSL PHP extension to be installed',
                'silktide'));
            wp_die(esc_html($message));
            exit();
        }
        /**
         * Check our cipher is available..
         */
        $ciphers = openssl_get_cipher_methods();
        if (in_array('AES-256-CBC', array_map('strtoupper', $ciphers), true)) {
            $message = sprintf(__('Sorry, Silktide requires the OpenSSL PHP extension to support the cipher AES-256-CBC.',
                'silktide'));
            wp_die(esc_html($message));
            exit();
        }
    }
}
