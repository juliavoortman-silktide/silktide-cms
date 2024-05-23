<?php
/**
 * @file
 * API Settings form functions.
 */

/**
 * API form callback.
 */
function silktide_admin_settings_form($form) {
  $path = drupal_get_path('module', 'silktide');
  $form['#attached'] = array(
    'js' => array(
      $path . '/assets/admin_settings_form.js',
    ),
  );

  $form['api'] = array(
    '#type' => 'fieldset',
    '#title' => t('API information'),
	'#description'=>t('Please see the <a href="https://support.silktide.com/guides/cms-install-drupal-guide/">configuration guide</a> or contact <a href="https://silktide.com/">Silktide</a> for assistance.')
  );

  $form['api']['silktide_api_key'] = array(
    '#type' => 'textfield',
    '#title' => t('API key'),
    '#required' => TRUE,
    '#default_value' => variable_get('silktide_api_key'),
    '#description' => t('Enter your API key provided by Silktide. Then you can test it by <a href="#" id="apidata">Clicking here.</a>'),
  );

  $form['api']['silktide_deferred_seconds'] = array(
    '#type' => 'textfield',
    '#title' => t('Delay in seconds before analyzing'),
    '#required' => FALSE,
    '#default_value' => variable_get('silktide_deferred_seconds'),
    '#description' => t('Enter the delay time in seconds you wish Silktide to wait before analyzing this page after being added or modified.'),
  );

   $form = system_settings_form($form);

  $form['#submit'][] = 'silktide_admin_settings_form_submit';

  return $form;
}


/**
 * API form validation callback.
 */

function silktide_admin_settings_form_validate($form, &$form_state) {

  if (isset($form_state['values']['silktide_api_key'])) {
    $form_state['values']['silktide_api_key'] = trim($form_state['values']['silktide_api_key']);
  
    if (strlen($form_state['values']['silktide_api_key']) != 32) {
      form_set_error('silktide_api_key', t('The API Key must be 32 characters long.'));
    }
    elseif (strlen(preg_replace('~[^a-zA-Z0-9]+~', '', $form_state['values']['silktide_api_key'])) != 32) {
      form_set_error('silktide_api_key', t('The API key contains invalid characters.'));
    }

    if ((int)$form_state['values']['silktide_deferred_seconds'] > 3600) {
        form_set_error('silktide_deferred_seconds', t('Value must be below 3600 seconds.'));
    }
  }
 
}

/**
 * API form submit callback.
 */

function silktide_admin_settings_form_submit($form, $form_state) {
    $apiKey = variable_get('silktide_api_key');
    $deferredSeconds = variable_get('silktide_deferred_seconds');
    $myfile = fopen(__DIR__."/silktide.txt", "w");
    $txt = $apiKey."|".$deferredSeconds;
    fwrite($myfile, $txt);
    fclose($myfile);
}
