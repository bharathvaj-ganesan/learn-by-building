import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { diffWords } from 'diff';
import { StateField, StateEffect, RangeSet } from '@codemirror/state';
import { Decoration } from '@codemirror/view';

let editor1, editor2, diffEditor;

export function setupDiffView(extensions = []) {
	const addDiffMark = StateEffect.define();
	
	const diffField = StateField.define({
		create() { return Decoration.none },
		update(decorations, tr) {
			return tr.effects.reduce((decorations, effect) => {
				return effect.is(addDiffMark) ? effect.value : decorations
			}, decorations)
		},
		provide: f => EditorView.decorations.from(f)
	});

	const createEditor = (parent, content) => {
		return new EditorView({
			extensions: [basicSetup],
			parent,
			state: EditorState.create({
				doc: content,
				extensions: [basicSetup, ...extensions],
			}),
		});
	};

	document.getElementById('file1').addEventListener('change', handleFileUpload);
	document.getElementById('file2').addEventListener('change', handleFileUpload);

	function handleFileUpload(event) {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = function (e) {
				if (event.target.id === 'file1') {
					if (!editor1) {
						editor1 = createEditor(document.getElementById('editor1'), e.target.result);
					} else {
						const newState = EditorState.create({
							doc: e.target.result,
						});
						editor1.setState(newState);
					}
				} else {
					if (!editor2) {
						editor2 = createEditor(document.getElementById('editor2'), e.target.result);
					} else {
						const newState = EditorState.create({
							doc: e.target.result,
						});
						editor2.setState(newState);
					}
				}
			};
			reader.readAsText(file);
		}
	}

	function getDiffContent(oldText, newText) {
		const diffs = diffWords(oldText, newText);
		let diffedContent = '';
		let decorations = [];
		let pos = 0;

		diffs.forEach((part) => {
			if (part.added) {
				decorations.push(Decoration.mark({
					class: "cm-diff-added"
				}).range(pos, pos + part.value.length));
				diffedContent += part.value;
			} else if (part.removed) {
				decorations.push(Decoration.mark({
					class: "cm-diff-removed"
				}).range(pos, pos + part.value.length));
				diffedContent += part.value;
			} else {
				diffedContent += part.value;
			}
			pos += part.value.length;
		});

		return { 
			diffedContent, 
			decorations: RangeSet.of(decorations) 
		};
	}

	function applyDiffStyles(view) {
		const diffElements = view.dom.querySelectorAll('.cm-diff-added, .cm-diff-removed');

		diffElements.forEach((el) => {
			if (el.classList.contains('cm-diff-added')) {
				el.style.backgroundColor = '#aaffaa'; // Light green for added content
			} else if (el.classList.contains('cm-diff-removed')) {
				el.style.backgroundColor = '#ffaaaa'; // Light red for removed content
			}
		});
	}

	document.getElementById('compare').addEventListener('click', () => {
		const text1 = editor1.state.doc.toString();
		const text2 = editor2.state.doc.toString();
		const diffResult = getDiffContent(text1, text2);

		if (!diffEditor) {
			diffEditor = new EditorView({
				state: EditorState.create({
					doc: diffResult.diffedContent,
					extensions: [
						basicSetup,
						diffField,
						EditorView.updateListener.of(() => {
							applyDiffStyles(diffEditor);
						})
					]
				}),
				parent: document.getElementById('diff-editor')
			});
		}

		diffEditor.dispatch({
			effects: addDiffMark.of(diffResult.decorations)
		});
	});
}
