// =============================================================================
// File: ide.js
// Version: 1.1
// 
// Initializes Synchi IDE.
// =============================================================================

// constants
var SYNCHI_IDE_EDITOR_DEFAULT_HEIGHT = 400;
var SYNCHI_IDE_TABS_DEFAULT_HEIGHT = 25;
var SYNCHI_IDE_HEIGHT_DIFFERENCE = 43;
var SYNCHI_IDE_WIDTH_DIFFERENCE = 2;

// variable 'constants'
var SYNCHI_EDITOR_DEFAULT_MAX_WIDTH = 500;

/**
 * Full screen on/off flag
 */
var synchiIDE_full_screen = false;

// =================================================== Clipboard Functions =====

/**
 * File clipboard [filepath,mode]
 */
var synchiIDE_clipboard = false;

/**
 * Performs file clipboard copy
 */
function synchiIDE_clipboard_copy(filepath) {
    var filename = filepath.split('/').pop();
    synchiIDE_clipboard = {
        filepath : filepath,
        mode : "copy"
    };
    if(filename == "") synchi_showMessage(synchi_labels['Directory copied'], 1500);
    else synchi_showMessage(synchi_labels['File copied'] + ': ' + filename, 1500);
}

/**
 * Performs file clipboard cut
 */
function synchiIDE_clipboard_cut(filepath) {
    var filename = filepath.split('/').pop();
    synchiIDE_clipboard = {
        filepath : filepath,
        mode : "cut"
    };
    if(filename == "") synchi_showMessage(synchi_labels['Directory cut'], 1500);
    else synchi_showMessage(synchi_labels['File cut'] + ': ' + filename, 1500);
}

/**
 * Performs file clipboard paste
 */
function synchiIDE_clipboard_paste(file) {
    if(!synchiIDE_clipboard) return;
    synchi_showLoadingMessage(synchi_labels['Copying']);
    synchi_call('paste_file', 
        {
            source:synchiIDE_clipboard.filepath,
            mode:synchiIDE_clipboard.mode,
            file:file.attr('rel')
        },
        function(response){
            if(response.status == 0) {
                synchi_hideMessage(function(){
                    synchi_showMessage(response.error,2000);
                });
                return;
            }
            synchi_hideMessage(function(){
                synchi_showMessage(synchi_labels['Done']+'.',1500);
                synchiIDE_sidebar_refresh('paste', function(){
                    synchiIDE_clipboard = false;
                });                
            });
        }
    );
}

// ========================================================= Tab Functions =====

/**
 * An array of opened tabs
 */
var synchiIDE_tabs = [];

/**
 * Focused tab
 */
var synchiIDE_focusedTab = null;

/**
 * Saves the index of the tab being moved
 */
var synchiIDE_tabs_sortStartIndex = -1;

/**
 * Class SynchiIDETab
 * 
 * Vars: id,file,focused,loading,changed,name,extension,fullName,tab,editor
 * Methods: close,unfocus,focus,loadingStart,loadingStop,change,clearChange
 */
function synchiIDE_tab(file,focus) {
    var self = {};
    
    self.id = "tab_" + Math.floor(Math.random()*1000000);
    self.file = file;
    self.focused = false;
    self.loading = false;
    self.changed = false;
    self.file_is_image = false;
    self.name = file.split('/').pop();
    self.extension = self.name.split('.').pop();
    self.fullName = file.replace(synchi_editor_root,"");
    self.tab = jQuery('<div class="tab"></div>');
    self.editor = jQuery('<div rel="'+self.id+'" class="synchi_ide_file" style="display:none"></div>');    
    
    self.close = function(forceClose) {
        // check if to save
        if(!forceClose && self.changed) {
            var save = confirm(synchi_labels['Save changes to']+" '"+self.name+"'?");
            if(!save) {
                self.close(true);
                return false;
            }
            synchi_showLoadingMessage(synchi_labels['Saving']+' ' + self.name);
            self.editor.save(
                function(){
                    synchi_hideMessage(function(){
                        synchi_showMessage(synchi_labels['File saved'] + ': ' + self.name + '.',1500);
                        self.close(true);
                    });
                },
                function(){
                    synchi_hideMessage(function(){
                        synchi_showMessage(synchi_labels['Error: file not saved'] + ': ' + self.name +'.',1500);
                    });
                }
            );
        }
        
        self.editor.remove();
        self.tab.remove();
        
        for(var i=0; i<synchiIDE_tabs.length; i++) {
            if(synchiIDE_tabs[i].id == self.id) {
                synchiIDE_tabs.splice(i,1);
                if(self.focused && synchiIDE_tabs.length > 0) synchiIDE_tabs[0].focus();
                break;
            }
        }
        
        synchiIDE_tabs_update();
        
        return false;
    }
    
    self.unfocus = function() {
        synchiIDE_focusedTab = false;
        self.tab.removeClass('focused');
        self.editor.hide();
        self.focused = false;
    }
    
    self.focus = function(callback) {
        if(synchiIDE_focusedTab == self) return false;
        if(synchiIDE_focusedTab != null) synchiIDE_focusedTab.unfocus();
        synchiIDE_focusedTab = self;
        self.tab.addClass('focused');
        self.editor.show();        
        self.focused = true;
        if(callback && typeof(callback) == 'function') callback();
        synchiIDE_tabs_update();
        return false;
    }
    
    self.loadingStart = function(text) {
        if(!text) text = "loading"
        self.loading = jQuery("<div style='width: 100%; margin-top: 40px; text-align:center'>"
            +'<img src="'+synchi_path+'img/loading_white.gif?v=1" /><br />'+text+'..'+
        "</div>");
        self.editor.after(self.loading);
        self.editor.hide();
    }
    
    self.loadingStop = function(callback) {
        if(self.loading !== false) self.loading.remove();
        self.editor.show();
        self.loading = false;
        if(callback && typeof(callback) == 'function') callback();
    }
    
    self.change = function() {
        self.changed = true;
        self.tab.addClass('changed');
    }
    
    self.clearChange = function() {
        self.changed = false;
        self.tab.removeClass('changed');
    }
    
    self.loadFile = function(displayed) {
        // show loader only if tab is focused
        if(displayed) self.loadingStart("opening file");

        // get file contents
        synchi_call('get_file_contents', {file:file}, function(response) {
            if(response.status == 0) {
                self.loadingStop(function(){
                    synchi_showMessage(response.error,1500);
                    self.close();
                });
                return;
            }
            var file_contents = response.result.contents;
            if(!file_contents) {
                self.loadingStop(function(){
                    synchi_showMessage("Unable to open \""+self.name+"\"!",1500);
                    self.close();
                });
                return;
            }
            // check if file is image
            if(response.result.file_is_image) {
                self.editor.html(file_contents).addClass('image_preview');
                self.loadingStop();
                self.file_is_image = true;
            }
            else {
                jQuery("<textarea></textarea>").appendTo(self.editor).text(file_contents);
                self.loadingStop(function(){
                    self.editor = self.editor.synchi(self.file,self.change,self,function(){
                        // enable context menu hiding on focus
                        jQuery("#jqContextMenu").hide().next('div').hide();
                    });
                    // init line numbers tooltip
                    var line_numbers = self.editor.find('.CodeMirror-gutter-text pre');
                    line_numbers.attr('title','Highligt line').tooltip();
                });
            }
            if(!displayed) self.editor.hide();
        });
    }

    // append to tabs
    synchiIDE_tabs[synchiIDE_tabs.length] = self;
    jQuery("#synchi_ide_tabs").append(self.tab);
    
    // determine file icon
    var file_img = synchi_path+'img/files/'+self.extension+'.png';
    
    // create and append tab link
    jQuery('<a class="file_link" style="background-image:url('+file_img+')" href="#" title="File: '+self.fullName+'">'+self.name+'</a>')
        .click(function(e){
            if (!e.which && e.button) {
                if (e.button & 1) e.which = 1;
                else if (e.button & 4) e.which = 2; // Middle
                else if (e.button & 2) e.which = 3;
            }
            if(e.which == 2) self.close();
            else self.focus();
            return false;
        })
        .dblclick(function(e){
            if (!e.which && e.button) {
                if (e.button & 1) e.which = 1;
                else if (e.button & 4) e.which = 2; // Middle
                else if (e.button & 2) e.which = 3;
            }
            if(e.which == 1) synchiIDE_editor_action('fullscreen');
            return false;
        })
        .appendTo(self.tab);
    jQuery('<a href="#" title="Close"></a>')
        .append('<img border="0" src="'+synchi_path+'img/ide/close.png" />')
        .click(self.close)
        .appendTo(self.tab);
    jQuery("#synchi_ide_editor").append(self.editor);
    
    // focus and load document
    if(focus) self.focus(function(){ self.loadFile(true); });
    else self.loadFile(false);
    
    // init context menu
    self.tab.contextMenu('synchi_ide_tabs_menu', {
        onShowMenu: function(event,menu) {
            synchiIDE_sidebar_select(jQuery(event.currentTarget));
            return menu;
        },
        bindings: {
            'synchi_tabs_save': function() {
                synchiIDE_openTab(self.file);
                synchiIDE_editor_action('save');
            },
            'synchi_tabs_close': function() {
                self.close();
            },
            'synchi_tabs_close_other': function() {
                synchiIDE_tabs_closeAll(self);
            },
            'synchi_tabs_close_all': function() {
                synchiIDE_tabs_closeAll();
            },
            'synchi_tabs_close_delete': function() {
                // TODO
                alert('Delete not implemented yet');
            },
            'synchi_tabs_close_download': function() {
                // TODO
                alert('Download not implemented yet');
            }
        }
    });
}

/**
 * Closes all tabs
 * 
 * @param exception if set this tab will not be closed
 */
function synchiIDE_tabs_closeAll(exception) {
    var i = 0;
    var tabs = [];
    for(i in synchiIDE_tabs) tabs[tabs.length] = synchiIDE_tabs[i];
    i = 0;
    for(i in tabs) {
        if(exception && tabs[i].id == exception.id) continue;
        tabs[i].close();
    }
}

/**
 * Opens a new tab with document to edit. If the document is already opened the
 * tab will gain focus.
 */
function synchiIDE_openTab(file,focus) {
    // make sure focus is defined
    if(typeof focus == 'undefined') focus = true;

    // go through all currently opened tabs
    for(var i=0; i<synchiIDE_tabs.length; i++) {
        // check if file already opened
        if(synchiIDE_tabs[i].file == file) {
            // simply focus on the tab
            if(focus) synchiIDE_tabs[i].focus();

            // stop execution
            return;
        }
    }

    // init tab
    synchiIDE_tab(file,focus);
}

/**
 * Handles tabs updated event
 * 1 - serializes tabs positions
 * 2 - handles tabs holder height
 */
function synchiIDE_tabs_update() {
    // 1 --> serialize tab positions
    var files = [];
    for(var i=0; i<synchiIDE_tabs.length; i++) files[files.length] = synchiIDE_tabs[i].file;
    synchi_call('serialize_tabs', {files:files,mode:synchi_editor_mode});
    
    // 2 --> handle tabs holder height
    var tab_holder = jQuery("#synchi_ide_tabs");
    var tabs = tab_holder.find(".tab");
    // calcluate tabs width
    var width = 0;
    tabs.each(function(){width += jQuery(this).width() + 3;});
    if(width < tab_holder.width()) {
        // set default height
        tab_holder.height(SYNCHI_IDE_TABS_DEFAULT_HEIGHT + "px");
    }
    else {
        // calculate new height
        var diff = Math.floor(width / tab_holder.width()) + 1;
        tab_holder.height((diff*SYNCHI_IDE_TABS_DEFAULT_HEIGHT) + "px");
    }

    // update entire dimensions
    synchiIDE_updateDimensions();    
}

/**
 * Returns a tab with a certain id
 * 
 * @param tab_id
 * @return tab or false if no tab with given id exists
 */
function synchiIDE_tabs_getById(tab_id) {
    for(var i=0; i<synchiIDE_tabs.length; i++) if(synchiIDE_tabs[i].id == tab_id) return synchiIDE_tabs[i];
    return false;
}

/**
 * Implements Shift-Tab functionality
 */
function synchiIDE_tabs_switch() {
    for(var i=0; i<synchiIDE_tabs.length; i++) {
        if(!synchiIDE_tabs[i].focused) continue;
        if(i == synchiIDE_tabs.length-1) {
            if(synchiIDE_tabs.length == 1) return;
            synchiIDE_tabs[i].unfocus();
            synchiIDE_tabs[0].focus();
            return;
        }
        synchiIDE_tabs[i].unfocus();
        synchiIDE_tabs[i+1].focus();
        return;
    }
}

// ====================================================== Editor Functions =====

/**
 * Performs Editor action
 * 
 * @param action to perform
 */
function synchiIDE_editor_action(action) {
    var tab = synchiIDE_focusedTab;
    switch(action) {
        case 'autocomplete':
            if(tab.editor.autocomplete) tab.editor.autocomplete(tab.editor.eitor);
            break;
        case 'save_all':
            synchi_showLoadingMessage(synchi_labels['Saving all files'] + '.');
            var changed = [];var i=0;
            for(i=0; i<synchiIDE_tabs.length; i++) 
                if(synchiIDE_tabs[i].changed && !synchiIDE_tabs[i].file_is_image) changed[changed.length] = synchiIDE_tabs[i];
            if(changed.length == 0) {
                synchi_hideMessage(); // [4.3 fix]
                return;
            }
            var saved_count = 0;
            var unsaved_count = 0;
            // start saving
            for(i=0; i<changed.length; i++) {
                changed[i].editor.save(
                    function(owner){saved_count++;owner.clearChange();},
                    function(){unsaved_count++;}
                );
            }
            // wait for save to end
            var ticker = function(){
                if(saved_count + unsaved_count == changed.length) {
                    synchi_hideMessage(function(){
                        synchi_showMessage(synchi_labels['Saved in total'] + ': ' + saved_count + '/' + changed.length,2000);
                    });
                    return;
                }
                setTimeout(ticker,100);
            };
            ticker();
        case 'save':
            if(!tab) return;
            if(tab.file_is_image) return;
            if(tab.editor.savingInProgress) return;
            if(!tab.changed) return;
            synchi_showLoadingMessage(synchi_labels['Saving'] + ' ' + tab.name);
            tab.editor.save(
                function(){
                    synchi_hideMessage(function(){
                        synchi_showMessage(synchi_labels['File saved'] + ': ' + tab.name + '.',1500);
                        tab.clearChange();
                    });
                },
                function(){
                    synchi_hideMessage(function(){
                        synchi_showMessage(synchi_labels['Error: file not saved'] + ': ' + tab.name + '.',1500);
                    });
                }
            );
            break;
        case 'comment':
            if(!tab) return;
            if(jQuery.inArray(tab.extension, ['php','js','css']) < 0) return;
            var range = tab.editor.range();
            tab.editor.editor.commentRange(true, range.from, range.to);
            break;
        case 'uncomment':
            if(!tab) return;
            if(jQuery.inArray(tab.extension, ['php','js','css']) < 0) return;
            var range = tab.editor.range();
            tab.editor.editor.commentRange(false, range.from, range.to);
            break;
        case 'find_prev':
            if(!tab) return;
            CodeMirror.commands.findPrev(tab.editor.editor);
            break;
        case 'search':
            if(!tab) return;
            CodeMirror.commands.find(tab.editor.editor);
            break;
        case 'find_next':
            if(!tab) return;
            CodeMirror.commands.findNext(tab.editor.editor);
            break;
        case 'search_replace':
            if(!tab) return;
            CodeMirror.commands.replaceAll(tab.editor.editor);
            break;
        case 'indent_left':
            if(!tab) return;
            tab.editor.editor.indentSelection('subtract');
            break;
        case 'format':
            if(!tab) return;
            tab.editor.editor.indentSelection('smart');
            break;
        case 'indent_right':
            if(!tab) return;
            tab.editor.editor.indentSelection('add'); 
            break;
        case 'undo':
            if(!tab) return;
            tab.editor.editor.undo();
            break;
        case 'redo':
            if(!tab) return;
            tab.editor.editor.redo();
            break;
        case 'goto':
            if(!tab) return;
            tab.editor.gotoLine();  
            break;
        case 'fullscreen':
            var ide = jQuery('#synchi_ide');
            if(synchiIDE_full_screen) {
                jQuery("#synchi_ide_editor").css('height','434px');
                jQuery("#synchi_ide_sidebar").css('height','434px');
                ide.removeClass('fullscreen');
                synchiIDE_full_screen = false;
                jQuery("#wpadminbar,#adminmenuback,#adminmenuwrap,#adminmenu").show();
                synchiIDE_tabs_update();
            }
            else {
                jQuery("#wpadminbar,#adminmenuback,#adminmenuwrap,#adminmenu").hide();
                ide.addClass('fullscreen');
                synchiIDE_full_screen = true;
                synchiIDE_tabs_update();
            }
            break;
        default:alert(synchi_labels['Not yet implemented']);
    }
}

/**
 * Updates entire IDE height
 */
function synchiIDE_updateDimensions() {
    if(synchiIDE_full_screen) {
        var ide_height = jQuery("#synchi_ide").height();
        var tabs_height = jQuery("#synchi_ide_tabs").height();
        jQuery("#synchi_ide_editor").css('height',(ide_height-SYNCHI_IDE_HEIGHT_DIFFERENCE-tabs_height)+'px');
        jQuery("#synchi_ide_sidebar").css('height',(ide_height-SYNCHI_IDE_HEIGHT_DIFFERENCE-tabs_height)+'px');
        jQuery('.synchi_ide_file').css('max-width',jQuery("#synchi_ide_editor").width() - SYNCHI_IDE_WIDTH_DIFFERENCE);
    }
    else {
        jQuery('.synchi_ide_file').css('max-width',SYNCHI_EDITOR_DEFAULT_MAX_WIDTH+'px');
    }
}

// ===================================================== Sidebar Functions =====

/**
 * Reinits the sidebar but attempts to display the same view as before
 * 
 * @param action (string) name of the action that triggered the refresh
 * @param callback (function) perform after refresh
 */
function synchiIDE_sidebar_refresh(action,callback) {
    // get selected file/folder
    var file = synchiIDE_getSelectedFile();
    var li = file.parent();
    
    if(!callback) callback = false;
    
    switch(action) {
        case 'delete':
            if(li.parent().find('li').length == 1) {
                // only file/folder in parent folder
                li.parent().parent().find('a:first').dblclick();
            }
            else li.remove();
            // check if file opened and close the tab
            for(var i in synchiIDE_tabs) {
                if(synchiIDE_tabs[i].file == file.attr('rel')) {
                    synchiIDE_tabs[i].close(true);
                    break;
                }
            }
            break;
        case 'new_file': case 'new_folder':
            var parent = (li.hasClass('directory')) ? li : li.parent().parent();
            if(parent.hasClass('directory')) {
                if(parent.hasClass('expanded')) parent.find('a:first').dblclick();
                parent.find('a:first').dblclick();
            }
            break;
        case 'paste':
            // check if delete must happen
            if(synchiIDE_clipboard.mode == 'cut') {
                // check if file/folder is displayed
                var source_li = jQuery("#synchi_ide_sidebar").find("a[rel jQuery= '"+synchiIDE_clipboard.filepath.replace(synchi_editor_root,'')+"']");
                if(source_li.length != 0) {
                    source_li = source_li.parent();
                    if(source_li.parent().find('li').length == 1) {
                        // only file/folder in parent folder
                        source_li.parent().parent().find('a:first').dblclick();
                    }
                    else source_li.remove();
                    // check if file opened and close the tab
                    for(var i in synchiIDE_tabs) {
                        if(synchiIDE_tabs[i].file == synchiIDE_clipboard.filepath) {
                            synchiIDE_tabs[i].close(true);
                            break;
                        }
                    }
                }
            }
            synchiIDE_sidebar_refresh('new_file',callback);
            return;
    }
    
    if(callback) callback();
}

/**
 * Selects a file in the sidebar
 * 
 * @param link to the file to select
 * @param closeMenu flag to determine if to close the menu after selecting
 */
function synchiIDE_sidebar_select(link,closeMenu) {
    jQuery("#synchi_ide_sidebar a").removeClass('selected');
    link.addClass('selected');
    jQuery("#synchi_ide_sidebar_filesize").text(synchi_labels['File size'] + ': '+link.attr('filesize'));
    if(closeMenu) jQuery("#jqContextMenu").hide().next('div').hide();
}

/**
 * Perorms Sidebar action
 * 
 * @param action
 */
function synchiIDE_sidebar_action(action) {
    var file = synchiIDE_getSelectedFile();
    switch(action) {
        case 'new_file':
            if(!file) {synchi_showMessage(synchi_labels['You must select a directory'] + '.', 1500);return;}
            var filename = prompt(synchi_labels['Enter filename'] + ':', 'newfile.txt');
            if(!filename || filename == "") return;
            synchi_showLoadingMessage(synchi_labels['Creating file'] + ' ' + filename);
            synchi_call('create_file', {file:file.attr('rel'),filename:filename}, function(response){
                if(response.status == 0) {
                    synchi_hideMessage(function(){
                        synchi_showMessage(response.error,2000);
                    });
                    return;
                }
                synchi_hideMessage(function(){
                    synchi_showMessage(synchi_labels['File created'] + ': ' + filename + '.',1500);
                    synchiIDE_sidebar_refresh(action);
                });
            });
            break;
        case 'new_folder':
            if(!file) {synchi_showMessage(synchi_labels['You must select a directory'] + '.', 1500);return;}
            var dirname = prompt(synchi_labels['Enter folder name'] + ':', 'newfolder');
            if(!dirname || dirname == "") return;
            synchi_showLoadingMessage(synchi_labels['Creating folder'] + ': ' + dirname);
            synchi_call('create_folder', {file:file.attr('rel'),dirname:dirname}, function(response){
                if(response.status == 0) {
                    synchi_hideMessage(function(){
                        synchi_showMessage(response.error,2000);
                    });
                    return;
                }
                synchi_hideMessage(function(){
                    synchi_showMessage(dirname + ' created.',1500);
                    synchiIDE_sidebar_refresh(action);
                });
            });
            break;
        case 'delete':
            if(!file) {synchi_showMessage(synchi_labels['Select a file/dir to delete'] + '.', 1500);return;}
            var filepath = file.attr('rel');
            var filename = filepath.split('/').pop();
            var filelabel = synchi_labels['Delete file'];
            var deletedlabel = synchi_labels['File deleted'];
            if(filename == "") {
                filename = synchi_labels['folder with all files and subfolders'];
                filelabel = synchi_labels['Delete folder'];
                deletedlabel = synchi_labels['Folder deleted'];
            }
            if(!confirm(filelabel + ' ' + filename + '?')) return;
            synchi_showLoadingMessage(synchi_labels['Deleting'] + ' ' + filename);
            synchi_call('delete_file', {filename:filepath}, function(response){
                if(response.status == 0) {
                    synchi_hideMessage(function(){
                        synchi_showMessage(response.error,2000);
                    });
                    return;
                }
                synchi_hideMessage(function(){
                    synchi_showMessage(deletedlabel + ': ' + filename + '.',1500)
                    synchiIDE_sidebar_refresh(action);
                });
            });
            break;
        case 'cut':
            if(!file) {synchi_showMessage(synchi_labels['Select a file/dir to cut'] + '.', 1500);return;}
            synchiIDE_clipboard_cut(file.attr('rel'));
            break;
        case 'copy':
            if(!file) {synchi_showMessage(synchi_labels['Select a file/dir to copy'] + '.', 1500);return;}
            synchiIDE_clipboard_copy(file.attr('rel'));
            break;
        case 'paste':
            if(!file) {synchi_showMessage(synchi_labels['You must select where to paste'] + '.', 1500);return;}
            synchiIDE_clipboard_paste(file);
            break;
        case 'upload':
            if(!file) {synchi_showMessage(synchi_labels['You must select where to upload'] + '.', 1500);return;}
            // TODO: implement
            alert(synchi_labels['Not yet implemented']);
            break;
        case 'download':
            if(!file) {synchi_showMessage(synchi_labels['Select a file/dir to download'] + '.', 1500);return;}
            // TODO: implement
            alert(synchi_labels['Not yet implemented']);
            break;
        default:synchi_showMessage(synchi_labels['Unknown control'] + '.', 1500);
    }
}

/**
 * Returns the anchor element of the file selected in the Sidebar 
 * 
 * @return file_link or false if no files are selected
 */
function synchiIDE_getSelectedFile() {
    var selected = jQuery("#synchi_ide_sidebar a.selected");
    if(selected.length == 0) return false;
    return selected;
}

// ======================================================== Init Functions =====

/**
 * Checks if there are unsaved changed documents in the Editor and asks the 
 * user if he wants to exit without saving.
 * 
 * @return question_text or null
 */
function synchiIDE_checkBeforeExit(event) {
    var changed = 0;
    for(var i=0; i<synchiIDE_tabs.length; i++) if(synchiIDE_tabs[i].changed) changed++;
    if(changed > 0) return synchi_labels['Exit without saving'] + '?';
    return null;
}

/**
 * Initializes Synchi file browsing Sidebar
 * - initializes jqueryFileTree script to render file browsing
 * - initializes contextmenu script to render menus
 */
function synchiIDE_initSidebar(initCallback) {
    jQuery("#synchi_ide_sidebar").fileTree({
        root: synchi_editor_root,
        script: synchi_path+"php/tree.php",
        folderEvent: "dblclick",
        selectCallback : synchiIDE_sidebar_select,
        linkBinding: function(link) {
            link.attr("id","sidebar_link_" + Math.floor(Math.random()*1000000));
            link.contextMenu('synchi_ide_sidebar_menu', {
                onShowMenu: function(event,menu) {
                    synchiIDE_sidebar_select(jQuery(event.currentTarget));
                    return menu;
                },
                bindings: {
                    'synchi_sidebar_new_file': function() {
                        synchiIDE_sidebar_action('new_file');
                    },
                    'synchi_sidebar_new_folder': function() {
                        synchiIDE_sidebar_action('new_folder');
                    },
                    'synchi_sidebar_delete': function() {
                        synchiIDE_sidebar_action('delete');
                    },
                    'synchi_sidebar_cut': function() {
                        synchiIDE_sidebar_action('cut');
                    },
                    'synchi_sidebar_copy': function() {
                        synchiIDE_sidebar_action('copy');
                    },
                    'synchi_sidebar_paste': function() {
                        synchiIDE_sidebar_action('paste');
                    },
                    'synchi_sidebar_upload': function() {
                        synchiIDE_sidebar_action('upload');
                    },
                    'synchi_sidebar_download': function() {
                        synchiIDE_sidebar_action('download');
                    }
                }
            });
        }
    }, 
    synchiIDE_openTab, (initCallback) ? initCallback : false);
}

/**
 * Initializes all Synchi keyboard bindings
 * - key bindings for editors
 * - key bindings for the file browsing Sidebar
 */
function synchiIDE_initKeyBindings() {
    
    // editor key bindings
    var bindings = {
        'Ctrl+Space' : function(event){ 
            synchiIDE_editor_action('autocomplete'); 
        },
        'Ctrl+s' : function(event){ 
            synchiIDE_editor_action('save'); 
        },
        'Ctrl+Shift+s' : function(event){ 
            synchiIDE_editor_action('save_all'); 
        },
        'Ctrl+q' : function(event){ 
            synchiIDE_editor_action('comment'); 
        },
        'Ctrl+Shift+q' : function(event){ 
            synchiIDE_editor_action('uncomment'); 
        },
        'Ctrl+f' : function(event){ 
            synchiIDE_editor_action('search'); 
        },
        'Ctrl+r' : function(event){ 
            synchiIDE_editor_action('search_replace'); 
        },
        'Ctrl+left' : function(event){ 
            synchiIDE_editor_action('find_prev'); 
        },
        'Ctrl+right' : function(event){ 
            synchiIDE_editor_action('find_next'); 
        },
        'Alt+Shift+left' : function(event){ 
            synchiIDE_editor_action('indent_left'); 
        },
        'Alt+Shift+right' : function(event){ 
            synchiIDE_editor_action('indent_right'); 
        },
        'Alt+Shift+f' : function(event){ 
            synchiIDE_editor_action('format'); 
        },
        'Ctrl+z' : function(event){ 
            synchiIDE_editor_action('undo'); 
        },
        'Ctrl+y' : function(event){ 
            synchiIDE_editor_action('redo'); 
        },
        'Ctrl+g' : function(event){ 
            synchiIDE_editor_action('goto'); 
        },
        'Alt+return' : function(event){ 
            synchiIDE_editor_action('fullscreen'); 
        },
        'Shift+Tab' : synchiIDE_tabs_switch
    };
    for(var index in bindings) shortcut.add(index,bindings[index]);
    
    // sidebar key bindings
    jQuery("#synchi_ide_sidebar")
        .hover(function() {this.focus();}, function() {this.blur();})
        .live('keyup',function(e){
        var file = synchiIDE_getSelectedFile();if(!file) return;
        var keycode = e ? e.which : window.event.keyCode;
        switch(keycode) {
            case jQuery.ui.keyCode.ENTER:
                file.dblclick();
                break;
            case jQuery.ui.keyCode.DELETE:
                synchiIDE_sidebar_action('delete');
                break;
            case jQuery.ui.keyCode.UP:
                var prev = file.parent().prev();
                if(prev.length == 0) {
                    var parent = file.parent().parent().parent();
                    if(parent.is('li')) synchiIDE_sidebar_select(parent.find('a:first'),true);
                    return;
                }
                if(prev.hasClass('directory') && prev.hasClass('expanded')) {
                    var link = prev.find('ul li:last a');
                    if(link.length != 0) synchiIDE_sidebar_select(link,true);
                }
                else synchiIDE_sidebar_select(prev.find('a:first'),true);
                break;
            case jQuery.ui.keyCode.DOWN:
                if(file.parent().hasClass('directory') && file.parent().hasClass('expanded')) {
                    var link = file.parent().find('ul li:first a');
                    if(link.length != 0) {
                        synchiIDE_sidebar_select(link,true);
                        return;
                    }
                }
                var next = file.parent().next();
                if(next.length == 0) {
                    var next_folder = file.parent('li').parent('ul').parent('li').next('li');
                    if(next_folder.length == 0) return;
                    synchiIDE_sidebar_select(next_folder.find('a:first'),true);
                    return;
                }
                synchiIDE_sidebar_select(next.find('a:first'),true);
                break;
            case jQuery.ui.keyCode.HOME:
                synchiIDE_sidebar_select(file.parent().parent().find("li:first a"),true);
                break;
            case jQuery.ui.keyCode.END:
                synchiIDE_sidebar_select(file.parent().parent().find("li:last a"),true);
                break;
            case jQuery.ui.keyCode.LEFT:
                if(file.parent().hasClass('directory')) {
                    if(file.parent().hasClass('expanded')) {
                        file.dblclick();
                        return;
                    }
                }
                var parent = file.parent().parent().parent();
                if(parent.is('li')) {
                    var link = parent.find('a:first');
                    link.dblclick();
                    synchiIDE_sidebar_select(link,true);
                }
                break;
            case jQuery.ui.keyCode.RIGHT:
                if(file.parent().hasClass('directory') && file.parent().hasClass('collapsed')) file.dblclick();
                break;
        }
    });
}

/**
 * Initializes Synchi editor tabs
 * - makes tabs sortable
 * - performs deserialization for previously opened documents
 */
function synchiIDE_initTabs() {
    // make tabs sortable
    jQuery('#synchi_ide_tabs').sortable({
        cursor: "move",
        start: function(event, ui) {
            var tab = jQuery(ui.item);
            synchiIDE_tabs_sortStartIndex = jQuery('#synchi_ide_tabs .tab').index(tab);
        },
        update: function(event, ui){
            var tab = jQuery(ui.item);
            var new_index = jQuery('#synchi_ide_tabs .tab').index(tab);
            var old_index = synchiIDE_tabs_sortStartIndex;
            if(new_index != old_index) {
                var saved_tabs = synchiIDE_tabs.splice(old_index, 1);
                synchiIDE_tabs.splice(new_index,0,saved_tabs[0]);
            }
            tab.find('.file_link').click();
        }
    }).disableSelection();
    
    // check if there are serialized tabs
    if(!synchi_serialized_tabs || synchi_serialized_tabs.length == 0) return;

    // handle serialized tabs
    for(var i=0; i<synchi_serialized_tabs.length; i++) {
        // reference tab
        var tab = synchi_serialized_tabs[i];

        // open tab with timeout
        setTimeout("synchiIDE_openTab('"+tab+"',"+((i == 0) ? 'true' : 'false')+")",i*300);

        // when last tab is opened, focus on first [4.3 fix]
        if(i == synchi_serialized_tabs.length-1) setTimeout(function(){
            // focus on the first tab
            synchiIDE_tabs[0].focus();
        },i*300);
    }
}

/**
 * Initializes Synchi IDE
 * - calls Synchi service to render the IDE
 * - initializes file browsing Sidebar
 * - binds window exit and resize events, keyboard events
 */
function synchiIDE_init() {
    // bind checking for opened documents before exit
    window.onbeforeunload = synchiIDE_checkBeforeExit;
    
    // bind resize to IDE editor
    jQuery(window).resize(synchiIDE_tabs_update);
    
    // bind click events to line numbers
    jQuery('.CodeMirror-gutter-text pre').live('click',function(){
        var line = Number(jQuery.trim(jQuery(this).text()))-1;
        var tab = synchiIDE_tabs_getById(jQuery(this).parents('.synchi_ide_file:first').attr('rel'));
        if(!tab) return;
        if(!tab.editor.editor.getLineHandle(line)) return;
        tab.editor.editor.setCursor(line,0);
        tab.editor.editor.setSelection(
            {line:line, ch:0},
            {line:line+1, ch:0}
        );
        tab.editor.editor.focus();
    });
    
    // load Synchi IDE
    synchi_showLoadingMessage(synchi_labels['Initializing Synchi IDE']);
    synchi_call('get_ide', {editor_mode: synchi_editor_mode}, function(response){
        if(response.status == 0) {
            synchi_hideMessage(function(){
                synchi_showMessage(synchi_labels['Unable to load Synchi IDE'] + ': ' + response.error,2000);
            });
            return;
        }
        // append HTML
        jQuery(".wrap").append(response.result);
        synchi_hideMessage(function(){
            // determine initial max width for editor
            SYNCHI_EDITOR_DEFAULT_MAX_WIDTH = jQuery("#synchi_ide_editor").width() - SYNCHI_IDE_WIDTH_DIFFERENCE;
            synchiIDE_initSidebar();
            synchiIDE_initKeyBindings();
            synchiIDE_initTabs();
        });
    });
}

// ================================================ On Load Initialization =====

jQuery(function(){
    // set context menu defaults
    jQuery.contextMenu.defaults({
        itemStyle : {
            "border" : "none",
            "font-size": "10px",
            "cursor": "pointer"
        },
        itemHoverStyle : {
            "background-color" : "#BDF",
            "border" : "none"
        },
        shadow: true
    });
    
    // remove WordPress components
    jQuery("#template").remove();
    jQuery("#templateside").remove();
    jQuery(".wrap .fileedit-sub").remove();
    
    // init Synchi IDE
    synchiIDE_init();
});