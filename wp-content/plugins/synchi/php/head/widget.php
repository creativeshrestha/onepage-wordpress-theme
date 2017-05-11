<?php

// =============================================================================
// File: widget.php
// Version: 1.1
//
// Includes head files for Synchi in text/HTML widgets
// =============================================================================

// check access
if(!defined('SYNCHI')) exit('Direct access is not allowed...');

$css_includes = array(
    // CodeMirror core
    'lib/codemirror/codemirror',
    // Synchi
    'css/synchi',
    // Widget styles
    'css/synchi_widget',
);

$js_includes = array(
    // CodeMirror core
    'lib/codemirror/codemirror',
    // CodeMirror modes
    'lib/codemirror/mode/clike',
    'lib/codemirror/mode/css',
    'lib/codemirror/mode/htmlmixed',
    'lib/codemirror/mode/javascript',
    'lib/codemirror/mode/mysql',
    'lib/codemirror/mode/php',
    'lib/codemirror/mode/xml',
    // Synchi
    'lib/synchi/jquery.synchi',
    'js/synchi_widget',
);

?>

<script type="text/javascript">
    var synchi_settings = <?php echo json_encode($synchi_settings); ?>;
    var synchi_path = '<?php echo WP_PLUGIN_URL; ?>/synchi/';
    var synchi_labels = [];
    <?php  // echo labels
    echo "synchi_labels['Initializing Synchi IDE'] = '".__('Initializing Synchi IDE','synchi')."';";
    echo "synchi_labels['Toggle Fullscreen'] = '".__('Toggle Fullscreen','synchi')."';";
    ?>
</script>

<?php

// include scripts
foreach($css_includes as $css) synchi_echoCSSinclude($css);
foreach($js_includes as $js) synchi_echoJSinclude($js);

// determine theme
if($synchi_settings['theme'] != 'default') synchi_echoCSSinclude("lib/codemirror/theme/{$synchi_settings['theme']}");