<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package alt
 */

?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">

<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
	<div id="skrollr-body">

<div id="page" class="site">
	<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', 'alternative-theme' ); ?></a>

	<header id="masthead" class="site-header" role="banner">
		<div class="container">

		<div class="site-branding">
			<?php
			if ( is_front_page() && is_home() ) : ?>
			<p class="site-title"><a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a></p>
			<?php else : ?>
				<div class="brand-name">
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><img src="<?php bloginfo('template_url'); ?>/img/logo.png" alt="<?php bloginfo('name'); ?>" /></a>
				</div>
			<?php endif; ?>
		</div><!-- .site-branding -->
		<?php /*
		<nav id="site-navigation" class="main-navigation" role="navigation">
			<button class="menu-toggle" aria-controls="primary-menu" aria-expanded="false"><?php esc_html_e( 'Primary Menu', 'alternative-theme' ); ?></button>
			/*
		</nav> #site-navigation

		 //get_search_form(); */ ?>

		<div class="navigation">
				<div class="mobilenav">
					<?php wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu' ) ); ?>
				</div>

				<a href="javascript:void(0)" class="icon">
					<div class="hamburger">
						<div class="menui top-menu"></div>
						<div class="menui mid-menu"></div>
						<div class="menui bottom-menu"></div>
					</div>
				</a>
				</div>
			</div>

	</header><!-- #masthead -->

	<div id="content" class="site-content">
