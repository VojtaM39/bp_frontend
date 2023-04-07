import { EditorHandler } from './editor.js';

document.addEventListener("DOMContentLoaded", function(){
    const editorHandler = new EditorHandler();
    editorHandler.registerEventHandlers();
});
