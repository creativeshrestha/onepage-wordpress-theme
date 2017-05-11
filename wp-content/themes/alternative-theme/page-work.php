<?php
/**
 * Template Name: Portfolio page
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

			<div id="fullpage" >
				<div class="section" style="display:none;"></div>
				<div class="page-banners">
					<?php if( is_page( 'work' ) ) { ?>
							<img src="<?php bloginfo('template_url'); ?>/img/work.jpg" alt="" />
							<h1><?php echo wp_title(''); ?></h1>
						<?php }; ?>
				</div>
			</div>

			<div class="container">

				<div class="work-wrapper">
					<?php
						$my_work = new WP_Query(array(
							'post_type' => 'work',
						));
					?>

					<?php while ($my_work->have_posts()) : $my_work->the_post(); ?>
						<div class="work-listing">
							<div class="image">
								<?php echo the_post_thumbnail('category-thumb'); ?>
							</div>
							<div class="">
								<span class="title">
									<h1><?php echo the_title(); ?></h1>
								</span>
							  <span class="details">
								 	<p> <?php echo the_content('description'); ?> </p>
									<p>
										<a class="readmore" href="<?php the_permalink() ?>" rel="bookmark"><?php _e( 'Read More &raquo;', 'leftside' ); ?></a>

									</p>
							  </span>
							</div>


						 </div>
					 <?php endwhile; ?>

			 </div>
		 </div>

		</main><!-- #main -->

	</div><!-- #primary -->

<?php

// get_sidebar();
get_footer();
