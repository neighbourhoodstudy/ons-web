<?php 
//this removes the annoying wrapping of everything in a <p> tag
//remove_filter (the_content, wpautop); 
?>

<?php
function ons_display_open_header() {
?>

<div class="loginout">


<span><?php wp_loginout( $redirect ); ?></span>
<span> | </span>
<span><?php wp_register('',''); ?></span>

</div>

<?php
}

function ons_enqueue_scripts() {
	wp_enqueue_script("ons-js-1", "http://ajax.googleapis.com/ajax/libs/dojo/1.7.1/dojo/dojo.js", array(), null);
	wp_enqueue_script("ons-js-2", "http://www.google.com/jsapi", array(), null);
	wp_enqueue_script("ons-js-3", "http://geoxml3.googlecode.com/svn/branches/polys/geoxml3.js", array(), null);
}

add_action('suffusion_page_header', 'ons_display_open_header');
add_action('wp_enqueue_scripts', 'ons_enqueue_scripts');
?>
