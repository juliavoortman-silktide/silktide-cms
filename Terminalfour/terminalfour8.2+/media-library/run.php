<?php
/* Version 1.0 */
$config = [];
$config['config']          = '<t4 type="media" formatter="path/*" id="<!-- INSERT ID -->" />';
$config['library']         = '<t4 type="media" formatter="path/*" id="<!-- INSERT ID -->" />';


require_once((strpos($config['library'], '.phar') !== false ? 'phar://' : '') . realpath($_SERVER["DOCUMENT_ROOT"]).$config['library'] . (strpos($config['library'], '.phar') !== false ? '/vendor/autoload.php' : ''));
$response = \T4\SilkTideIntegration\SilkTide::sendSilktideRequest($_SERVER['DOCUMENT_ROOT'].$config['config']);

header_remove();
@header('Content-Type: application/json');
echo json_encode($response);
