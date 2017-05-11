<?php
/**
 * Template Name: Home page
 */

get_header(); ?>


<div id="primary" class="content-area">
	<main id="main" class="site-main" role="main">

		<div id="fullpage" class="home-page">

			<div class="section" id="section0">
				<div class="container">

						<div class="heading-title" data-0="transform: translateY(-5%);" data-end="transform: translateY(700px);">
								<h1>we believe, you can change the world <br/>
								when you look beyond the obvious<br/>
								and think beyond the ordinary.</h1>
						</div>

				</div>
			</div> <!--/section0 -->

		</div> <!-- /fullpage -->

		<div id="section1" class="section">
			<div class="container">
					<h2>about <span>know more about us</span></h2>

					<?php
						$my_about = new WP_Query(array(
							'post_type' => 'about',
							'posts_per_page' => 2
						));
					?>

					<?php while ($my_about->have_posts()) : $my_about->the_post(); ?>
						<div class="about-us">
						<?php echo the_post_thumbnail('category-thumb'); ?>
						 <h1><?php echo the_title(); ?></h1>
						 <p> <?php echo the_content('description'); ?> </p>

						 <?php //dynamic_sidebar( 'custombanner' ); ?>
						 </div>
					 <?php endwhile; ?>

			</div>
		</div> <!--/section0 -->

		<div class="section2" id="section2">
			<div class="container">
					<h2>latest work <span>what we do</span></h2>

					<?php
						$my_work = new WP_Query(array(
							'post_type' => 'work',
							'posts_per_page' => 7
						));
					?>

					<?php while ($my_work->have_posts()) : $my_work->the_post(); ?>
						<div class="work">
						<?php echo the_post_thumbnail('category-thumb'); ?>

						 <?php //dynamic_sidebar( 'custombanner' ); ?>
						 </div>
					 <?php endwhile; ?>

				<div class="work">
						<a href="<?php bloginfo('url') ?>/work"><img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" /></a>
				</div>

			</div>
		</div> <!--/section0 -->

		<div class="section3" id="section3">
			<div class="container">
					<h2>approch <span>how we do it</span></h2>

					<?php
						$my_approch = new WP_Query(array(
							'post_type' => 'approch',
							'posts_per_page' => 3
						));
					?>

					<?php while ($my_approch->have_posts()) : $my_approch->the_post(); ?>
						<div class="approch">
						<?php echo the_post_thumbnail('category-thumb'); ?>
						 <h1><?php echo the_title(); ?></h1>
						 <p> <?php echo the_content('description'); ?> </p>

						 <?php //dynamic_sidebar( 'custombanner' ); ?>
						 </div>
					 <?php endwhile; ?>


			</div>
		</div> <!--/section0 -->

		<div class="section4" id="section2">
			<div class="container">
					<h2>Our team <span>who we are</span></h2>

				<div class="work">
						<img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" />
				</div>
				<div class="work">
						<img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" />
				</div>
				<div class="work">
						<img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" />
				</div>
				<div class="work">
						<img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" />
				</div>
				<div class="work">
						<img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" />
				</div>
				<div class="work">
						<img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" />
				</div>
				<div class="work">
						<img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" />
				</div>
				<div class="work">
						<a href="<?php bloginfo('url');?>/team" class="cta"><img src="<?php bloginfo('template_url'); ?>/img/work1.jpg" alt="" /></a>
				</div>

			</div>
		</div> <!--/section0 -->

		<div id="section5" class="section">
			<div class="container" class="section">
					<h2>Blog <span>write-up about</span></h2>

					<?php
						query_posts('cat=blog', 'posts_per_page=3'); ?>
						<?php while (have_posts()) : the_post(); ?>
						<div class="blog-home" >
							<?php echo the_post_thumbnail('category-thumb'); ?>
							<h1><?php echo the_title(); ?></h1>
							<?php echo the_excerpt(60); ?>
						</div>
					<?php endwhile; ?>
					<div class="next-section">
						<a href="#" class="cta">next</a>
					</div>


			</div>
		</div> <!--/section0 -->

		<div id="section6" class="sect ion">
				<div class="contact">
						<div class="feature_map">
							<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3608.8900018530107!2d55.307342576721204!3d25.240629614961573!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xa6897741cb2643fd!2sAlternative!5e0!3m2!1sen!2sae!4v1459166351615" width="100%" height="768" frameborder="0" style="border:0" allowfullscreen></iframe>
						</div>

						<div class="contact-wrapper">
							<div class="container">
									<div class="address">
											m03, al shraifi centre, zabeel road <br>
											p.o. box 34263 <br>
											dubai, uae <br><br>

											phone +971 4 396 4141 <br><br>

											for job opportunities <a href="http://mbr-me.com">click here</a>
									</div>
									<div class="contact-footer">
										<?php echo do_shortcode('[contact-form-7 id="97" title="footer-contact"]') ?>
									</div>

								</div>
						</div>
				</div>

		</div> <!--/section0 -->

		</main><!-- #main -->
	</div><!-- #primary -->

<?php
// get_sidebar();
get_footer();
