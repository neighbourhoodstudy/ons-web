<?php 
//update_option('siteurl','http://staging.neighbourhoodstudy.ca/');
//update_option('home','http://staging.neighbourhoodstudy.ca/');
//this removes the annoying wrapping of everything in a <p> tag
//remove_filter (the_content, wpautop); 
?><?php
// First check for our own lang cookie
// Redirect to lang.html if not found
if ($_COOKIE['onslang'] == '') {
	header("HTTP/1.1 301"); 
	header( 'Location: lang.html' );	
	exit;
}


function ons_display_open_header() {
?>

  <div class="loginout">
    <span><?php wp_loginout( $redirect ); ?></span>
    <span> | </span>
    <span><?php wp_register('',''); ?></span>
  </div>

  <!-- header links -->
  <div style="position: absolute; top: 25px;">
    <img id="Image-Maps_7201206261231527" src="/wp-content/uploads/2012/06/transparent.png"" usemap="#Image-Maps_7201206261231527" border="0" width="1000" height="100" alt="">
    <map id="_Image-Maps_7201206261231527" name="Image-Maps_7201206261231527">
      <area shape="rect" coords="5,25,188,115" href="http://neighbourhoodstudy.ca/" alt="Ottawa Neighbourhood Study" title="Ottawa Neighbourhood Study">
      <area shape="rect" coords="197,53,348,120" href="http://ottawa.ca/en/health_safety/about/oph/index.html" alt="Ottawa Public Health" title="Ottawa Public Health">
      <area shape="rect" coords="353,53,477,120" href="http://www.uottawa.ca/" alt="University of Ottawa" title="University of Ottawa">
      <area shape="rect" coords="478,53,622,120" href="http://www.coalitionottawa.ca" alt="Coalition of Community and Health" title="Coalition of Community and Health">
      <area shape="rect" coords="622,53,715,120" href="http://www.ibm.com" alt="IBM" title="IBM">
      <area shape="rect" coords="716,53,844,120" href="http://www.champlainlhin.on.ca" alt="Champlain Local Health" title="Champlain Local Health">
      <area shape="rect" coords="847,53,991,120" href="http://www.unitedway.org" alt="United Way" title="United Way">
    </map>
  </div>

<?php
}

function ons_enqueue_scripts_and_css() {
	wp_enqueue_script("ons-js-1", "http://ajax.googleapis.com/ajax/libs/dojo/1.7.1/dojo/dojo.js", array(), null);
	wp_enqueue_script("ons-js-2", "http://www.google.com/jsapi", array(), null);
	wp_enqueue_script("ons-js-3", "http://geoxml3.googlecode.com/svn/branches/polys/geoxml3.js", array(), null);
	
	//google maps
	wp_enqueue_script("ons-js-4", "http://maps.googleapis.com/maps/api/js?key=AIzaSyD4Nh2-wpGCZL9kawcmhMsiARvN73XEqmY&sensor=true&libraries=geometry", array(), null);
	
	//jquery
	wp_enqueue_script("ons-js-5a", "http://neighbourhoodstudy.ca/wp-content/themes/ons/jquery-1.8.2.min.js", array(), null);
	wp_enqueue_script("ons-js-5b", "http://neighbourhoodstudy.ca/wp-content/themes/ons/jquery.collapsible.js", array(), null);
	wp_enqueue_script("ons-js-5bb", "http://neighbourhoodstudy.ca/wp-content/themes/ons/select/jquery.ui.core.js", array(), null);
	wp_enqueue_script("ons-js-5c", "http://neighbourhoodstudy.ca/wp-content/themes/ons/select/jquery.ui.widget.js", array(), null);
	wp_enqueue_script("ons-js-5d", "http://neighbourhoodstudy.ca/wp-content/themes/ons/select/jquery.ui.position.js", array(), null);
	wp_enqueue_script("ons-js-5e", "http://neighbourhoodstudy.ca/wp-content/themes/ons/select/jquery.ui.selectmenu.js", array(), null);
	
	//our custom js
	wp_enqueue_script("ons-js-7", "http://neighbourhoodstudy.ca/wp-content/themes/ons/maps2011.js", array(), null);

	//spinner js
	wp_enqueue_script("ons-js-7a", "http://neighbourhoodstudy.ca/wp-content/themes/ons/spin.min.js", array(), null);

	//to remove
	//wp_enqueue_script("ons-js-7", "http://neighbourhoodstudy.ca/wp-content/themes/ons/maps.js", array(), null);
	//wp_enqueue_script("ons-js-8", "http://neighbourhoodstudy.ca/wp-content/themes/ons/onsdata.js", array(), null);
	//wp_enqueue_script("ons-js-9", "http://neighbourhoodstudy.ca/wp-content/themes/ons/onsmarkers.js", array(), null);

	//new google api
	wp_enqueue_script("ons-js-4a", "https://apis.google.com/js/client.js?onload=onGoogleLoad", array(), null);
	
	
	//css
	wp_enqueue_style( 'select1',  "http://neighbourhoodstudy.ca/wp-content/themes/ons/select/themes/base/jquery.ui.core.css");
    wp_enqueue_style( 'select2',  "http://neighbourhoodstudy.ca/wp-content/themes/ons/select/themes/base/jquery.ui.theme.css");
    wp_enqueue_style( 'select3',  "http://neighbourhoodstudy.ca/wp-content/themes/ons/select/themes/base/jquery.ui.selectmenu.css");
    
}

add_action('suffusion_page_header', 'ons_display_open_header');
add_action('wp_enqueue_scripts', 'ons_enqueue_scripts_and_css');

//add claro
add_filter('body_class','add_category_to_single');
function add_category_to_single($classes, $class) {
	$classes[] = 'claro';
	return $classes;
}
?>
