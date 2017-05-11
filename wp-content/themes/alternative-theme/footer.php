<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package alt
 */

?>

	</div><!-- #content -->

	<footer id="colophon" class="site-footer" role="contentinfo">
		<div class="container">

		<div class="site-info">
			<?php dynamic_sidebar( 'socialfooter' ); ?><br>
			<?php printf( esc_html__( '&copy; Copyright: 2016')); ?>
		</div><!-- .site-info -->

		</div>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>
</div> <!-- /skroll-body -->
</body>
</html>
