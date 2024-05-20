<?php
/**
 * Plugin Name:         Silktide
 * Plugin URI:          https://support.silktide.com/guides/cms-integrations/how-to-integrate-silktide-with-wordpress/
 * Description:         Integrate your WordPress website with <a href="https://www.silktide.com">Silktide</a>
 * Version:             1.2.0
 * Author:              Silktide Ltd
 * Author URI:          https://silktide.com/
 * Text Domain:         silktide
 * License:             GPLv2 or later
 * @package Silktide
 */

// Check that the file is nto accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    die( 'We\'re sorry, but you can not directly access this file.' );
}

require_once plugin_dir_path( __FILE__ ) . '/class-silktide.php';

new Silktide();
