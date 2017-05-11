<?php
/**
 * Template Name: Blog page
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package alt
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<h1>sdfsdf</h1>
			<div id="fullpage" >
				<div class="section" style="display:none;"></div>
				<div class="page-banners">
					<?php if( is_page( 'clients' ) ) { ?>
							<img src="<?php bloginfo('template_url'); ?>/img/work.jpg" alt="" />
							<h1><?php echo wp_title('our'); ?></h1>
						<?php }; ?>
				</div>
			</div>
		<?php
		if ( have_posts() ) :

			if ( is_home() && ! is_front_page() ) : ?>
				<header>
					<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
				</header>

			<?php
			endif;

			/* Start the Loop */
			while ( have_posts() ) : the_post();
				get_template_part( 'template-parts/content', get_post_format() );

			endwhile;

			the_posts_navigation();

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif; ?>

		</main><!-- #main -->

	</div><!-- #primary -->

<?php

// get_sidebar();
get_footer();
