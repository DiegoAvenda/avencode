// Quick Notes — reference solution.
// A notes app in 100% Vanilla JS: no frameworks, no bundlers.
// How to run: open index.html in any browser (double-click the file).
//
// The file has 3 parts:
//   Part 1 — Global state (the notes array + the undo stack).
//   Part 2 — Logic and render functions (load, save, render, add, delete, undo).
//   Part 3 — Event listeners (wiring buttons to logic).

// ---------------------------------------------------------------------------
// Grab the DOM nodes once, up front, by the ids index.html defines.
// If any of these ids were missing, the lookup would return null.
// ---------------------------------------------------------------------------
const input = document.getElementById('note-input');
const addButton = document.getElementById('add-btn');
const undoButton = document.getElementById('undo-btn');
const notesSection = document.getElementById('notes');
const status = document.getElementById('status');

// ===========================================================================
// PART 1 — GLOBAL STATE
// ===========================================================================

// Every note is a small object: a stable numeric id plus its text.
// The array is the single source of truth; the page is rebuilt from it.
const notes = loadNotes() || [
	{ id: 1, text: 'Buy milk' },
	{ id: 2, text: 'Read one page' }
];

// The next id must never collide, even with notes loaded from storage,
// so start it past the highest id we already have.
let nextId = 1;
for (const note of notes) {
	if (note.id >= nextId) {
		nextId = note.id + 1;
	}
}

// The undo history: a native Array used as a Stack.
// Delete does push(), Undo does pop() — Last-In First-Out (LIFO), so the
// most recently deleted note is always the first one restored.
const undoStack = [];

// The key under which the notes array is persisted in localStorage.
const STORAGE_KEY = 'quick-notes';

// ===========================================================================
// PART 2 — LOGIC AND RENDER FUNCTIONS
// ===========================================================================

// Load the saved array back. Anything unexpected (nothing saved, corrupt
// text, wrong shape) falls back to null so the caller can use the starters.
function loadNotes() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw === null) {
			return null;
		}
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) {
			return parsed;
		}
		return null;
	} catch {
		console.log('Saved notes were unreadable. Starting fresh.');
		return null;
	}
}

// Persist the whole array as text. Called after every mutation.
function saveNotes() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// Rebuild the page from the state array. Clearing first guarantees the page
// can never drift from the data: one array change, one repaint, zero drift.
function render() {
	// 1. Empty the container.
	notesSection.innerHTML = '';

	// 2. Build one card per note with the DOM API (no innerHTML templates).
	for (const note of notes) {
		const card = document.createElement('div');
		card.className = 'note';

		const text = document.createElement('p');
		text.className = 'note-text';
		// textContent (never innerHTML) keeps user words as plain text.
		text.textContent = note.text;
		card.appendChild(text);

		const remove = document.createElement('button');
		remove.className = 'note-delete';
		remove.textContent = 'Delete';
		remove.type = 'button';
		// Each button closes over its own note id, so it deletes exactly
		// the card it sits on.
		remove.addEventListener('click', function () {
			deleteNote(note.id);
		});
		card.appendChild(remove);

		notesSection.appendChild(card);
	}

	// 3. Keep the count in sync and report to the console.
	status.textContent = notes.length + ' notes';
	console.log('Rendered ' + notes.length + ' notes.');
}

// Add the input text as a new note object, then persist and re-render.
function addNote() {
	const text = input.value.trim();
	if (text === '') {
		console.log('Empty note ignored.');
		return;
	}
	notes.push({ id: nextId, text: text });
	nextId = nextId + 1;
	input.value = '';
	input.focus();
	saveNotes();
	render();
}

// Remove one note by id — but push it onto the undo stack first, so the
// deletion stays reversible. Then persist and re-render as usual.
function deleteNote(id) {
	const index = notes.findIndex(function (note) {
		return note.id === id;
	});
	if (index !== -1) {
		const removed = notes.splice(index, 1)[0];
		undoStack.push(removed);
		console.log('Deleted. The stack holds ' + undoStack.length + '.');
	}
	saveNotes();
	render();
}

// Restore the most recently deleted note (LIFO). An empty pop() gives
// undefined, and checking for it keeps Undo safe instead of crashing.
function undo() {
	const restored = undoStack.pop();
	if (restored === undefined) {
		console.log('Nothing to undo.');
		return;
	}
	notes.push(restored);
	saveNotes();
	render();
	console.log('Undid the delete: ' + restored.text);
}

// ===========================================================================
// PART 3 — EVENT LISTENERS
// ===========================================================================

// One listener per button: clicks flow into the logic functions above.
addButton.addEventListener('click', addNote);
undoButton.addEventListener('click', undo);

// First paint from state (loaded or starter), then report what we found.
render();
console.log('Loaded ' + notes.length + ' notes from storage.');
