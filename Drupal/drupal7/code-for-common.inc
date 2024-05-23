<?php

/**
* Returns elements that are always displayed in the HEAD tag of the HTML page.
*/
function _drupal_default_html_head() {
    if ($node = menu_get_object()) {
        $nodeId = $node->nid;
    }

    $elements = [];
    if (!empty($nodeId)) {
        $url = url('node/'.$nodeId.'/edit', array('absolute' => true));
        $base64Link = base64_encode(json_encode([
            'editorUrl' => $url
        ]));

        $elements['system_meta_silktide-cms'] = array(
            '#type' => 'html_tag',
            '#tag' => 'meta',
            '#attributes' => array(
                'name' => 'silktide-cms',
                'content' => $base64Link,
            ),
            // Security: This always has to be output first.
            '#weight' => -1000,
        );

        $elements['system_meta_silktide-cms-raw'] = array(
            '#type' => 'html_tag',
            '#tag' => 'meta',
            '#attributes' => array(
                'name' => 'silktide-cms-raw',
                'content' => $url,
            ),
            // Security: This always has to be output first.
            '#weight' => -1000,
        );
    }

    return $elements;
}