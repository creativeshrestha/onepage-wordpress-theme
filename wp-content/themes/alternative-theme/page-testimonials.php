<?php
/**
 * Template Name: Testimonials page
 *
 */

get_header(); ?>

	<div id="primary" class="content-area">
		<main id="main" class="site-main" role="main">
			<div id="fullpage" >
				<div class="section" style="display:none;"></div>
				<div class="page-banners">
					<?php if( is_page( 'clients' ) ) { ?>
							<img src="<?php bloginfo('template_url'); ?>/img/work.jpg" alt="" />
							<h1><?php echo wp_title('our'); ?></h1>
						<?php }; ?>
				</div>
			</div>
			<div class="container">

					<?php
						$my_work = new WP_Query(array(
							'post_type' => 'work'
						));
					?>

					<?php while ($my_work->have_posts()) : $my_work->the_post(); ?>
						<div class="work">
						<?php echo the_post_thumbnail('category-thumb'); ?>

						 <?php //dynamic_sidebar( 'custombanner' ); ?>
						 </div>
					 <?php endwhile; ?>

			</div>
		</main><!-- #main -->

	</div><!-- #primary -->

<?php

get_footer();
