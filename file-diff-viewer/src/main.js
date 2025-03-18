import './style.css';
// import { setupBasicEditor, updateContent } from './basic-editor';
import { setupDiffView } from './diff-view';


document.querySelector('#app').innerHTML = `
  <div class="container">
    <h1>File Diff Viewer</h1>
    <div class="file-inputs">
      <input type="file" id="file1">
      <input type="file" id="file2">
      <button id="compare">Compare</button>
    </div>
    <div class="editors-container">
      <div class="editor-column">
        <h3>File 1</h3>
        <div id="editor1" class="editor"></div>
      </div>
      <div class="editor-column">
        <h3>File 2</h3>
        <div id="editor2" class="editor"></div>
      </div>
      <div class="editor-column">
        <h3>Differences</h3>
        <div id="diff-editor" class="editor"></div>
      </div>
    </div>
  </div>
`;

// Set up a basic editor
// setupBasicEditor(document.getElementById('editor'), 'hello world');

/**
 *  <div>
      <h1>File Diff Viewer</h1>
      <div id="editor"></div>
      <button id="update">Update</button>
    </div>
 */

// document.getElementById('update').addEventListener('click', () => {
// 	updateContent('hello world 2');
// });

setupDiffView();