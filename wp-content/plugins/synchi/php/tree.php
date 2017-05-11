<?php

// =============================================================================
// File: tree.php
// Version: 2.0
// 
// File system tree generator.
// =============================================================================

// check access
if(!defined('SYNCHI')) exit('Direct access is not allowed...');

/**
 * Checks if a string starts with another string
 *
 * @param $haystack
 * @param $needle
 * @return bool
 */
function startsWith($haystack, $needle)
{
    return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
}

/**
 * Checks if a string ends with another string
 *
 * @param $haystack
 * @param $needle
 * @return bool
 */
function endsWith($haystack, $needle)
{
    $length = strlen($needle);
    if ($length == 0) return true;
    $start = $length * -1; //negative
    return (substr($haystack, $start) === $needle);
}

/**
 * Determines file size
 *
 * @param $file
 * @return float
 */
function determineFileSize($file)
{
    $bytes = @filesize($file);
    $precision = 2;
    $units = array('B', 'KB', 'MB', 'GB', 'TB');
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    // $bytes /= (1 << (10 * $pow)); 
    return round($bytes, $precision) . ' ' . $units[$pow];
}

// get root directory
$root_directory = urldecode($_REQUEST['dir']);

// determine mode
if (endsWith($root_directory, "/plugins/"))
{
    $synchi_mode = "plugins";

    // include dependencies
    include_once( ABSPATH . 'wp-admin/includes/plugin.php' );

    // get all plugins
    $plugins = get_plugins();

    /**
     * Gets a plugin based on directory
     *
     * @param $directory
     * @return bool|string
     */
    $getPlugin = function($directory) use($plugins)
    {
        // go through all plugins
        foreach($plugins as $plugin => $info)
        {
            if(startsWith($plugin,$directory . '/')) return $plugin;
        }

        // default
        return false;
    };
}
else if (endsWith($root_directory, "/themes/")) $synchi_mode = "themes";
else $synchi_mode = "unknown";

// skip if directory doesn't exist
if (!file_exists($root_directory)) die;

// get files
$content = scandir($root_directory);

// sort files
natcasesort($content);

// skip first 2 ('.' and '..')
array_shift($content);
array_shift($content);

// init files and folders
$files = array();
$folders = array();

// go through all files (content)
foreach ($content as $content_item)
{
    // skip if file/dir doesn't exist
    if (!file_exists($root_directory . $content_item)) continue;

    // determine if this is a folder
    if (is_dir($root_directory . $content_item)) $folders[] = $content_item;
    else $files[] = $content_item;
}

// display
?>
    <ul class="jqueryFileTree" style="display: none;">

        <!-- Folders -->
        <?php foreach ($folders as $folder)
        {
            ?>
            <li class="directory collapsed">
                <a filesize="<?php echo determineFileSize($root_directory . $folder); ?>" href="#"
                    <?php if ($synchi_mode == 'plugins' && is_plugin_active($getPlugin($folder)))
                    { ?> style="color: #16a085;" <?php } ?>

                    <?php if ($synchi_mode == 'themes' && $folder == get_template())
                    { ?> style="color: #16a085;" <?php } ?>

                   rel="<?php echo htmlentities($root_directory . $folder) ?>/">
                    <?php echo htmlentities($folder) ?>
                </a>
            </li>
        <?php } ?>

        <!-- Files -->
        <?php if ($synchi_mode == "unknown") foreach ($files as $file)
        {
            // determine extension
            $ext = preg_replace('/^.*\./', '', $file);

            ?>
            <li class="file ext_<?php echo $ext; ?>">
                <a filesize="<?php echo determineFileSize($root_directory . $file); ?>" href="#"
                   rel="<?php echo htmlentities($root_directory . $file) ?>">
                    <?php echo htmlentities($file); ?>
                </a>
            </li>
        <?php } ?>
    </ul>