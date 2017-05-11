// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function noop() {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place any jQuery/helper plugins in here.

//custom jQuery
$(document).ready(function() {
    //alert("test");

    //fullPage
    $('#fullpage').fullpage({
        //anchors: ['firstPage', 'secondPage', '3rdPage'],
        //sectionsColor: ['#C63D0F', '#1BBC9B', '#7E8F7C', '#f2f2f2', '#999999'],
        css3: true,
        navigation: false,
        scrollingSpeed: 1200,
        fitToSection: false,
        autoScrolling: false
    }); // end fullPage

    var s = skrollr.init();

    jQuery.scrollSpeed(200, 1000);

    $(window).on("scroll", function() {
        var offsetHeight = document.getElementById('fullpage').offsetHeight;
        if($(window).scrollTop() > offsetHeight) {
            $("#masthead").addClass("active");
        } else {
           $("#masthead").removeClass("active");
        }
    });

}); //end $document.ready
