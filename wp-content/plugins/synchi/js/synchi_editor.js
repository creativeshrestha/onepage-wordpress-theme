// =============================================================================
// File: synchi_editor.js
// Version: 2.2
// 
// Enables synchi editor for articles
// =============================================================================

var synchi_editor = false;
var synchi_mode = 'n/a'; // html,visual
var synchi_full_screen = false;
var synchi_controls = false;
var synchi_lock = false;

/**
 * Performs a synchi control action
 *
 * @param control string control name
 */
function synchi_Control(control) {
    switch (control) {
        case 'search':
            CodeMirror.commands.find(synchi_editor.editor);
            break;
        case 'find_prev':
            CodeMirror.commands.findPrev(synchi_editor.editor);
            break;
        case 'find_next':
            CodeMirror.commands.findNext(synchi_editor.editor);
            break;
        case 'search_replace':
            CodeMirror.commands.replaceAll(synchi_editor.editor);
            break;
        case 'undo':
            synchi_editor.editor.undo();
            break;
        case 'redo':
            synchi_editor.editor.redo();
            break;
        case 'goto':
            synchi_editor.gotoLine();
            break;
        case 'format':
            synchi_editor.editor.indentSelection('smart');
            break;
        case 'indent_left':
            synchi_editor.editor.indentSelection('subtract');
            break;
        case 'indent_right':
            synchi_editor.editor.indentSelection('add');
            break;
        case 'fullscreen':
            var container = jQuery('#wp-content-editor-container');
            if (container.hasClass('synchi_full_screen')) {
                jQuery("#wpadminbar,#adminmenuback,#adminmenuwrap,#adminmenu").show();
                container.removeClass('synchi_full_screen');
                synchi_full_screen = false;
            }
            else {
                jQuery("#wpadminbar,#adminmenuback,#adminmenuwrap,#adminmenu").hide();
                container.addClass('synchi_full_screen');
                synchi_full_screen = true;
                synchi_editor.focus();
            }
            break;
    }
}

/**
 * Initializes the editor
 */
function synchi_InitEditor() {
    // skip if already initialized
    if(synchi_editor) return;

    // init editor
    synchi_editor = jQuery("#content").parent().synchi('file.html');

    // show Synchi controls
    synchi_controls.synchi.show();
}

/**
 * Switches the editor between modes
 *
 * @param mode switch to
 * @param element caller
 */
function synchi_switchMode(mode, element) {
    // check lock
    if (synchi_lock) return false;

    // enable lock
    synchi_lock = true;

    // check mode
    switch (mode) {
        case 'visual':
            if (synchi_mode != 'visual' && synchi_editor) {
                // clear editor
                synchi_editor.editor.toTextArea();
                synchi_editor = false;

                // show content media buttons
                jQuery('#wp-content-media-buttons').show();

                // hide Synchi controls
                synchi_controls.synchi.hide();

                // set mode
                synchi_mode = 'visual';
            }

            break;
        case 'html':
            if (synchi_mode != 'html') {
                // init editor
                synchi_InitEditor();

                // hide content media buttons
                jQuery('#wp-content-media-buttons').hide();

                // set mode
                synchi_mode = 'html';
            }

            break;
    }

    setTimeout(function () {
        // release lock
        synchi_lock = false;

        // perform default behaviour
        switchEditors.switchto(element);
    }, 256);

    return false;
}

// On Load
jQuery(function () {

    // skip if TinyMCE is not defined
    if (typeof(tinyMCE) == "undefined") return;

    // init controls menu
    synchi_controls = {};
    synchi_controls.original = jQuery("#ed_toolbar");
    synchi_controls.parent = synchi_controls.original.parent();

    // hide original controls imediately
    synchi_controls.original.hide();

    // show loader
    synchi_showLoadingMessage(synchi_labels['Initializing Synchi IDE']);

    // get editor controls
    synchi_call('get_editor_controls', {}, function (response) {
        // reference Synchi controls
        synchi_controls.synchi = jQuery(response.result).hide();

        // determine mode
        synchi_mode = (tinyMCE.activeEditor == null || tinyMCE.activeEditor.isHidden() != false) ? 'html' : 'visual';

        // override switch button clicks
        jQuery('#content-tmce').click(function () { return synchi_switchMode('visual', this); });
        jQuery('#content-html').click(function () { return synchi_switchMode('html', this); });

        // bind click events to line numbers
        jQuery('.CodeMirror-gutter-text pre').live('click', function () {
            if (!synchi_editor) return;
            var line = Number(jQuery.trim(jQuery(this).text())) - 1;
            if (!synchi_editor.editor.getLineHandle(line)) return;
            synchi_editor.editor.setCursor(line, 0);
            synchi_editor.editor.setSelection(
                {line: line, ch: 0},
                {line: line + 1, ch: 0}
            );
            synchi_editor.editor.focus();
        });

        // bind key shortcuts
        var bindings = {
            'Ctrl+f': function (event) {
                if (synchi_editor) synchi_Control('search');
            },
            'Ctrl+r': function (event) {
                if (synchi_editor) synchi_Control('search_replace');
            },
            'Ctrl+left': function (event) {
                if (synchi_editor) synchi_Control('find_prev');
            },
            'Ctrl+right': function (event) {
                if (synchi_editor) synchi_Control('find_next');
            },
            'Alt+Shift+left': function (event) {
                if (synchi_editor) synchi_Control('indent_left');
            },
            'Alt+Shift+right': function (event) {
                if (synchi_editor) synchi_Control('indent_right');
            },
            'Alt+Shift+f': function (event) {
                if (synchi_editor) synchi_Control('format');
            },
            'Ctrl+z': function (event) {
                if (synchi_editor) synchi_Control('undo');
            },
            'Ctrl+y': function (event) {
                if (synchi_editor) synchi_Control('redo');
            },
            'Ctrl+g': function (event) {
                if (synchi_editor) synchi_Control('goto');
            },
            'Alt+return': function (event) {
                if (synchi_editor) synchi_Control('fullscreen');
            }
        };
        for (var index in bindings) shortcut.add(index, bindings[index]);

        // append controls
        synchi_controls.parent.prepend(synchi_controls.synchi);

        // hide loader
        synchi_hideMessage();

        // init editor if HTML mode active
        if (synchi_mode == 'html') synchi_InitEditor();
    });

});