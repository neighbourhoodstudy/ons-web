/**
 * Collapsible plugin
 *
 * Copyright (c) 2010 Ramin Hossaini (www.ramin-hossaini.com)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

jQuery.collapsible = function(selector, identifier) {
	
	//toggle the div after the header and set a unique-cookie
	$j(selector).click(function() {
		$j(this).next().slideToggle('fast', function() {
			if ( $j(this).is(":hidden") ) {
				//$j.cookie($(this).prev().attr("id"), 'hide');
				$j(this).prev().children(".placeholder").removeClass("collapse").addClass("expand");
			}
			else {
				//$j.cookie($(this).prev().attr("id"), 'show');
				$j(this).prev().children(".placeholder").removeClass("expand").addClass("collapse");
			}
		});
		return false;
	}).next();

	
	//show that the header is clickable
	$j(selector).hover(function() {
		$j(this).css("cursor", "pointer");
	});

	/*
	 * On document.ready: should the module be shown or hidden?
	 */
	var idval = 0;	//increment used for generating unique ID's
	$j.each( $j(selector) , function() {

		$j($j(this)).attr("id", "module_" + identifier + idval);	//give each a unique ID

		if ( !$j($j(this)).hasClass("collapsed") ) {
			$j("#" + $j(this).attr("id") ).append("<span class='placeholder collapse'></span>");
		}
		else if ( $j($j(this)).hasClass("collapsed") ) {
			//by default, this one should be collapsed
			$j("#" + $j(this).attr("id") ).append("<span class='placeholder expand'></span>");
		}
		
		//what has the developer specified? collapsed or expanded?
		if ( $j($j(this)).hasClass("collapsed") ) {
			$j("#" + $j(this).attr("id") ).next().hide();
			$j("#" + $j(this).attr("id") ).children("span").removeClass("collapse").addClass("expand");
		}
		else {
			$j("#" + $j(this).attr("id") ).children("span").removeClass("expand").addClass("collapse");
		}

	
		

		idval++;
	});

};
