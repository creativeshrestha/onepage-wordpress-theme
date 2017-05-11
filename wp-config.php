<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'alt_theme');

/** MySQL database username */
define('DB_USER', 'root');

/** MySQL database password */
define('DB_PASSWORD', 'root');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         '8aVg%,tWu4fO(>_A}kb/>=-qSNOXx>XBt`STfch@+;7VIBaZMj !#+g^#.$[>)$l');
define('SECURE_AUTH_KEY',  '2)^`sqjsR^HPQZc^YO:FXiK@>}^LfiF5n n9BmP2=i25c$][ZJMiIqV@|p_1uF(r');
define('LOGGED_IN_KEY',    '&fyATls>B]cVNy[)g3tI;q!]90Zv1(Y1^ff3q/FqJdY~F4` ,FL04u|Mmbkt/ut-');
define('NONCE_KEY',        '6^dd$}t[|_>&(:n6jBw!~T~5X6zBVt3<Hg(Crm5DqNsrlp~g4Ai`R?@?#!sHP|6Y');
define('AUTH_SALT',        '5nvh;I,u,:$ _lw<,4uu9qV.^-x1/%{d`*o[_l9b;$./R/UyYTZVe;`t!lC;KvLS');
define('SECURE_AUTH_SALT', '#a-N=pio7bE`DqBDJf;p[ufMfFL4c-2 Ep0C]a]$1@>-pE %-G;veWp2b^g!z*aj');
define('LOGGED_IN_SALT',   'U7GvxsSm~|D1dqpY>GLmomb2c)^R/pLn-Vd-hBh`SBma1Nq|][|:u-Mx,;#$<UNv');
define('NONCE_SALT',       '4{h@jN?~uS/^3,R4@%*p;nhr0g>^yF*NaaL( bfh+4^VK@?-50B8Y`QZkM,^{`3.');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
