// =============================================================================
// File: synchi_widget.js
// Version: 1.1
//
// Enables synchi syntax highlight for text/HTML widgets
// =============================================================================

/**
 * Initializes synchi editor on a texarea container
 *
 * @param container
 */
function synchi_init(container) {
    // init synchi editor
    container.synchi('file.html');

    // insert the controls container
    var controls = jQuery('<div class="synchi_widget_controls"></div>');
    container.find('.CodeMirror').before(controls);

    // insert full screen control
    jQuery('<a href="#" onclick="return false" title="'+synchi_labels['Toggle Fullscreen']+'"><img src="'+synchi_path+'img/ide/fullscreen.png" /></a>')
        .click(function(){
        if(container.hasClass('synchi_full_screen')) {
            jQuery("#wpadminbar,#adminmenuback,#adminmenuwrap,#adminmenu").show();
            container.removeClass('synchi_full_screen');
        }
        else {
            jQuery("#wpadminbar,#adminmenuback,#adminmenuwrap,#adminmenu").hide();
            container.addClass('synchi_full_screen');
        }
    })
        .appendTo(controls);
}

/**
 * Performs initializations on page load
 */
function synchi_onLoad() {
    synchi_hideMessage();

    // set live behaviour for widgets show/hide links
    jQuery('.widget .widget-action.hide-if-no-js').live('click',function(){
        // get link
        var link = jQuery(this);

        // get parent widget
        var widget = link.parents('.widget');

        // check if it is text widget
        if(widget.attr('id').indexOf('_text-') == -1) return;

        // get widget inside
        var widget_inside = widget.find('.widget-inside');

        // check if visible
        if(!widget_inside.is(":visible")) return;

        // get the textarea container
        var container = widget.find('.widget-content');

        // check if synchi already inited
        if(container.find('.CodeMirror').length != 0) return;

        // init synchi
        synchi_init(container);
    });

    // set live behaviour for widget save buttons
    jQuery('.widget input[name="savewidget"]').live('click',function(){
        // get link
        var link = jQuery(this);

        // get parent widget
        var widget = link.parents('.widget');

        // check if it is text widget
        if(widget.attr('id').indexOf('_text-') == -1) return;

        // get widget inside
        var widget_inside = widget.find('.widget-inside');

        // hide widget inside
        widget_inside.fadeOut(150);

        // setup working function
        var worker = function(widget) {
            // get the textarea container
            var container = widget.find('.widget-content');

            // check if synchi already inited
            if(container.find('.CodeMirror').length != 0) {
                setTimeout(function(){ worker(widget); },54);
                return;
            }

            // show widget inside
            widget.find('.widget-inside').fadeIn(300);

            // init synchi
            synchi_init(container);
        }

        // start worker
        worker(widget);
    });
}

// On Load
jQuery(function(){
    synchi_showLoadingMessage(synchi_labels['Initializing Synchi IDE']);
    setTimeout(synchi_onLoad, 1000);
});