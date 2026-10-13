// Skill Roadmap — reference solution.
// A prerequisite skill map in 100% Vanilla JS: no frameworks, no bundlers,
// no Canvas (layers would use CSS Grid, connectors plain SVG).
// How to run: open index.html in any browser (double-click the file).
//
// The file has 4 parts:
//   Part 1 — Global state (the nodes signal: id/title/status/prerequisites).
//   Part 2 — Pure logic (status, depth, cycles, suggested order, progress).
//   Part 3 — The reactivity engine (signals, effects, memos from closures).
//   Part 4 — Views as effects plus event listeners (writes only, no renders).
//
// KNOWN LIMITATION (lesson 16, fixed in Module 1): the engine notifies
// subscribers depth-first with no topological ordering, so in a diamond
// (two branches converging on one reader) a shared effect runs twice and
// can observe a mix of new and stale values.

// ---------------------------------------------------------------------------
// Grab the DOM nodes once, up front, by the ids index.html defines.
// If any of these ids were missing, the lookup would return null.
// ---------------------------------------------------------------------------
const titleInput = document.getElementById('node-title');
const addButton = document.getElementById('add-btn');
const fromInput = document.getElementById('edge-from');
const toInput = document.getElementById('edge-to');
const addEdgeButton = document.getElementById('add-edge-btn');
const roadmap = document.getElementById('roadmap');
const status = document.getElementById('status');
const nextList = document.getElementById('next-list');
const counts = document.getElementById('counts');

// ===========================================================================
// PART 3 — THE REACTIVITY ENGINE (declared first so parts below read cleanly)
// ===========================================================================

// The computation currently collecting dependencies, if any.
let currentSubscriber = null;

// A signal: private value plus a Set of subscribers. Reading inside an
// effect or memo subscribes the running computation automatically.
function createSignal(initial) {
	let value = initial;
	const subscribers = new Set();
	return {
		get: function () {
			if (currentSubscriber !== null) {
				subscribers.add(currentSubscriber);
			}
			return value;
		},
		set: function (next) {
			if (Object.is(next, value)) {
				return;
			}
			value = next;
			const snapshot = Array.from(subscribers);
			for (const subscriber of snapshot) {
				subscriber();
			}
		}
	};
}

// An effect runs now and re-runs whenever a signal it read changes.
function createEffect(fn) {
	const run = function () {
		currentSubscriber = run;
		try {
			fn();
		} finally {
			currentSubscriber = null;
		}
	};
	run();
}

// ===========================================================================
// PART 1 — GLOBAL STATE
// ===========================================================================

// Every skill is a small object: a stable string id, a title, a stored
// status ('done', 'in-progress' or 'todo'), its prerequisite ids, and the
// branch it belongs to. The signal holding the array is the single source
// of truth; every view below is an effect reading it.
const STORAGE_KEY = 'skill-roadmap';

function seedNodes() {
	return [
		{ id: 'html', title: 'HTML Basics', status: 'done', prerequisites: [], branch: 'Markup' },
		{ id: 'css', title: 'CSS Basics', status: 'in-progress', prerequisites: ['html'], branch: 'Styling' },
		{ id: 'js', title: 'JS Basics', status: 'todo', prerequisites: ['css'], branch: 'Scripting' },
		{ id: 'dom', title: 'DOM Intro', status: 'todo', prerequisites: ['html', 'js'], branch: 'Scripting' },
		{ id: 'events', title: 'Events', status: 'todo', prerequisites: ['dom'], branch: 'Scripting' }
	];
}

// Load the saved array back. Anything unexpected (nothing saved, corrupt
// text, wrong shape) falls back to null so the caller can use the seeds.
function loadNodes() {
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
		console.log('Saved map was unreadable. Starting fresh.');
		return null;
	}
}

const nodesSignal = createSignal(loadNodes() || seedNodes());

// Persist the whole array as text. Called after every mutation.
function saveNodes() {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(nodesSignal.get()));
}

// ===========================================================================
// PART 2 — PURE LOGIC (no DOM, no signals: safe to unit-test in isolation)
// ===========================================================================

function nodeById(list, id) {
	for (const node of list) {
		if (node.id === id) {
			return node;
		}
	}
	return undefined;
}

// Derived display status: stored 'done'/'in-progress' win, otherwise every
// prerequisite must be done for 'ready', else 'blocked'.
function getStatus(list, node) {
	switch (node.status) {
		case 'done':
			return 'done';
		case 'in-progress':
			return 'in progress';
		default: {
			const allDone = node.prerequisites.every(function (id) {
				return nodeById(list, id) !== undefined && nodeById(list, id).status === 'done';
			});
			switch (allDone) {
				case true:
					return 'ready';
				default:
					return 'blocked';
			}
		}
	}
}

// Would adding "fromId requires toId" close a loop? DFS from toId with a
// visited set, reporting whether fromId is reachable.
function wouldCreateCycle(list, fromId, toId) {
	if (fromId === toId) {
		return true;
	}
	const visited = new Set();
	function reaches(id) {
		if (id === fromId) {
			return true;
		}
		if (visited.has(id)) {
			return false;
		}
		visited.add(id);
		const node = nodeById(list, id);
		const parents = node === undefined ? [] : node.prerequisites;
		for (const parent of parents) {
			if (reaches(parent)) {
				return true;
			}
		}
		return false;
	}
	return reaches(toId);
}

// Suggested order for reaching a goal: prerequisites first, goal last
// (DFS post-order over prerequisites).
function suggestedOrder(list, goalId) {
	const visited = new Set();
	const order = [];
	function visit(id) {
		if (visited.has(id)) {
			return;
		}
		visited.add(id);
		const node = nodeById(list, id);
		const parents = node === undefined ? [] : node.prerequisites;
		for (const parent of parents) {
			visit(parent);
		}
		order.push(id);
	}
	visit(goalId);
	return order;
}

function slug(title) {
	return title.toLowerCase().trim().split(' ').join('-');
}

// ===========================================================================
// PART 4 — VIEWS AS EFFECTS PLUS EVENT LISTENERS
// ===========================================================================

// Mutations only touch state: they build the next array and set it once.
// No render calls anywhere — the effects below repaint themselves.
function markDone(id) {
	const next = nodesSignal.get().map(function (node) {
		if (node.id === id) {
			return { id: node.id, title: node.title, status: 'done', prerequisites: node.prerequisites, branch: node.branch };
		}
		return node;
	});
	nodesSignal.set(next);
	saveNodes();
}

function addNode() {
	const title = titleInput.value.trim();
	if (title === '') {
		console.log('A skill needs a title.');
		return;
	}
	const id = slug(title);
	if (nodeById(nodesSignal.get(), id) !== undefined) {
		console.log('That id is taken: ' + id);
		return;
	}
	const next = nodesSignal.get().slice();
	next.push({ id: id, title: title, status: 'todo', prerequisites: [], branch: 'Scripting' });
	titleInput.value = '';
	nodesSignal.set(next);
	saveNodes();
}

function addEdge() {
	const from = fromInput.value.trim();
	const to = toInput.value.trim();
	const list = nodesSignal.get();
	if (from === '' || to === '') {
		console.log('Both fields need an id.');
	} else if (nodeById(list, from) === undefined || nodeById(list, to) === undefined) {
		console.log('Unknown skill id.');
	} else if (nodeById(list, from).prerequisites.indexOf(to) !== -1) {
		console.log('That link already exists.');
	} else if (wouldCreateCycle(list, from, to)) {
		console.log('Refused: that link would close a loop.');
	} else {
		const next = list.map(function (node) {
			if (node.id === from) {
				const parents = node.prerequisites.slice();
				parents.push(to);
				return { id: node.id, title: node.title, status: node.status, prerequisites: parents, branch: node.branch };
			}
			return node;
		});
		nodesSignal.set(next);
		saveNodes();
	}
}

// The roadmap view: one card per skill with its derived status.
createEffect(function () {
	const list = nodesSignal.get();
	roadmap.innerHTML = '';
	for (const node of list) {
		const card = document.createElement('div');
		card.className = 'node';

		const heading = document.createElement('p');
		heading.className = 'node-title';
		heading.textContent = node.title;
		card.appendChild(heading);

		const state = document.createElement('p');
		state.className = 'node-status';
		state.textContent = getStatus(list, node);
		card.appendChild(state);

		const done = document.createElement('button');
		done.className = 'node-done';
		done.textContent = 'Done';
		done.type = 'button';
		// Each button closes over its own skill id, so it completes exactly
		// the card it sits on.
		done.addEventListener('click', function () {
			markDone(node.id);
		});
		card.appendChild(done);

		roadmap.appendChild(card);
	}
	status.textContent = list.length + ' skills on the map';
});

// The next-step plus counters view: every ready skill, plus done-of-total.
createEffect(function () {
	const list = nodesSignal.get();
	nextList.innerHTML = '';
	const ready = list.filter(function (node) {
		return getStatus(list, node) === 'ready';
	});
	for (const node of ready) {
		const item = document.createElement('li');
		item.className = 'next-item';
		item.textContent = node.title;
		nextList.appendChild(item);
	}
	const done = list.filter(function (node) {
		return node.status === 'done';
	}).length;
	counts.textContent = done + ' of ' + list.length + ' skills done';
});

// One listener per button: input flows into state, effects do the rest.
addButton.addEventListener('click', addNode);
addEdgeButton.addEventListener('click', addEdge);

// First paint happens inside the effects above (they run on creation).
console.log('Suggested path to events: ' + suggestedOrder(nodesSignal.get(), 'events').join(' -> '));
