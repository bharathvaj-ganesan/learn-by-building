import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';

let editorView;

export function setupBasicEditor(parent, content) {
	let initialDoc = content;

	// Create the initial editor state
	let state = EditorState.create({
		doc: initialDoc,
		extensions: [basicSetup],
	});

	// Initialize the editor view
	editorView = new EditorView({
		state,
		parent,
	});
}

// Function to update content
export function updateContent(newContent) {
	// Create a new editor state with the new content
	let newState = EditorState.create({
		doc: newContent,
		extensions: [basicSetup],
	});

	// Update the editor view with the new state
	editorView.setState(newState);
}
