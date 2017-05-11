<?php
/**
 * Template Name: Single page
 */

 get_header(); ?>

 	<div id="primary" class="content-area">
 		<main id="main" class="site-main" role="main">
      <div id="fullpage" >
        <div class="section" style="display:none;"></div>
        <div class="page-banners">
            <img src="<?php bloginfo('template_url'); ?>/img/work.jpg" alt="" />
            <h1><?php echo wp_title(''); ?></h1>
        </div>
      </div>
      <div class="container">
   			<?php
   			  while ( have_posts() ) : the_post();

   				get_template_part( 'template-parts/content', 'page' );

   				// If comments are open or we have at least one comment, load up the comment template.
   				if ( comments_open() || get_comments_number() ) :
   					comments_template();
   				endif;

   			  endwhile; // End of the loop.
   			?>
      </div>
 		</main><!-- #main -->
 	</div><!-- #primary -->

 <?php
 // get_sidebar();
 get_footer();
