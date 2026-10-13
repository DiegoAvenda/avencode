/**
 * Reference engine for Module 0 ("Skill Roadmap").
 *
 * These are the canonical implementations of what learners build across the
 * lessons: derived node status (A3), layer depth (A6), cycle detection (A7),
 * suggested order (A9), progress math (A5), and the minimal reactivity engine
 * (B2–B4: signals, effects, memos). `tests/roadmap.test.js` is the executable
 * spec; the learner-facing starter code in `curriculum/` mirrors these
 * functions in vanilla page scripts.
 *
 * KNOWN LIMITATION (taught in lesson 16, fixed in Module 1): this engine
 * notifies subscribers depth-first with no topological ordering, so in a
 * diamond (two branches converging on one node) a downstream effect runs
 * twice and can observe a mix of new and stale values. See the diamond test.
 */

/**
 * @typedef {{ id: string, title: string, status: 'done' | 'in-progress' | 'todo', prerequisites: string[], branch?: string }} SkillNode
 */

/**
 * Derived display status of one node.
 * Stored status wins for 'done'/'in-progress'; otherwise every prerequisite
 * must be done for the node to be 'ready', else it is 'blocked'.
 * @param {SkillNode} node
 * @param {SkillNode[]} nodes
 * @returns {'done' | 'in-progress' | 'ready' | 'blocked'}
 */
export function getStatus(node, nodes) {
	switch (node.status) {
		case 'done':
			return 'done';
		case 'in-progress':
			return 'in-progress';
		default: {
			const byId = new Map(nodes.map((entry) => [entry.id, entry]));
			const allDone = (node.prerequisites || []).every(
				(id) => byId.get(id) !== undefined && byId.get(id).status === 'done'
			);
			switch (allDone) {
				case true:
					return 'ready';
				default:
					return 'blocked';
			}
		}
	}
}

/**
 * Layer depth of every node: 0 with no prerequisites, else one past the
 * deepest prerequisite. Unknown prerequisite ids count as depth 0.
 * @param {SkillNode[]} nodes
 * @returns {Record<string, number>}
 */
export function computeDepth(nodes) {
	const byId = new Map(nodes.map((entry) => [entry.id, entry]));
	/** @type {Record<string, number>} */
	const depths = {};
	/** @param {string} id @param {Set<string>} seen */
	function depthOf(id, seen) {
		if (depths[id] !== undefined) return depths[id];
		if (seen.has(id)) return 0;
		seen.add(id);
		const node = byId.get(id);
		let depth = 0;
		if (node && Array.isArray(node.prerequisites)) {
			for (const parent of node.prerequisites) {
				depth = Math.max(depth, depthOf(parent, seen) + 1);
			}
		}
		seen.delete(id);
		depths[id] = depth;
		return depth;
	}
	for (const node of nodes) depthOf(node.id, new Set());
	return depths;
}

/**
 * Would adding "fromId requires toId" create a cycle? True for self-edges
 * and when fromId is already reachable from toId (DFS with a visited set).
 * @param {SkillNode[]} nodes
 * @param {string} fromId
 * @param {string} toId
 * @returns {boolean}
 */
export function wouldCreateCycle(nodes, fromId, toId) {
	if (fromId === toId) return true;
	const byId = new Map(nodes.map((entry) => [entry.id, entry]));
	const visited = new Set();
	/** @param {string} id */
	function reaches(id) {
		if (id === fromId) return true;
		if (visited.has(id)) return false;
		visited.add(id);
		const node = byId.get(id);
		const parents = node && Array.isArray(node.prerequisites) ? node.prerequisites : [];
		for (const parent of parents) {
			if (reaches(parent)) return true;
		}
		return false;
	}
	return reaches(toId);
}

/**
 * Suggested order for reaching a goal: prerequisites first, goal last
 * (DFS post-order over prerequisites, starting at the goal).
 * @param {SkillNode[]} nodes
 * @param {string} goalId
 * @returns {string[]}
 */
export function topoOrder(nodes, goalId) {
	const byId = new Map(nodes.map((entry) => [entry.id, entry]));
	const visited = new Set();
	/** @type {string[]} */
	const order = [];
	/** @param {string} id */
	function visit(id) {
		if (visited.has(id)) return;
		visited.add(id);
		const node = byId.get(id);
		const parents = node && Array.isArray(node.prerequisites) ? node.prerequisites : [];
		for (const parent of parents) visit(parent);
		order.push(id);
	}
	visit(goalId);
	return order;
}

/**
 * Nodes the learner can start today: stored 'todo' with every prerequisite
 * done (derived 'ready').
 * @param {SkillNode[]} nodes
 * @returns {SkillNode[]}
 */
export function nextSteps(nodes) {
	return nodes.filter((node) => getStatus(node, nodes) === 'ready');
}

/**
 * Progress of one branch (or all nodes when `branch` is undefined).
 * @param {SkillNode[]} nodes
 * @param {string} [branch]
 * @returns {{ total: number, done: number, percent: number }}
 */
export function branchProgress(nodes, branch) {
	const scoped = branch === undefined ? nodes : nodes.filter((node) => node.branch === branch);
	const total = scoped.length;
	const done = scoped.filter((node) => node.status === 'done').length;
	return { total, done, percent: total === 0 ? 0 : Math.round((done / total) * 100) };
}

/** Progress over every node. */
export function globalProgress(nodes) {
	return branchProgress(nodes, undefined);
}

// ---------------------------------------------------------------------------
// Minimal reactivity engine (lessons B2–B4).
// A signal holds a value plus a Set of subscribers. Reading inside an effect
// or memo subscribes the running computation via `currentSubscriber`.
// ---------------------------------------------------------------------------

/** The computation currently collecting dependencies, if any. */
let currentSubscriber = null;

/**
 * @param {any} initial
 * @returns {{ get: () => any, set: (next: any) => void, subscribe: (fn: () => void) => () => void }}
 */
export function createSignal(initial) {
	let value = initial;
	/** @type {Set<() => void>} */
	const subscribers = new Set();
	return {
		get() {
			if (currentSubscriber !== null) subscribers.add(currentSubscriber);
			return value;
		},
		set(next) {
			if (Object.is(next, value)) return;
			value = next;
			for (const subscriber of Array.from(subscribers)) subscriber();
		},
		subscribe(fn) {
			subscribers.add(fn);
			return () => subscribers.delete(fn);
		}
	};
}

/**
 * Run `fn` now and re-run it whenever a signal read inside it changes.
 * @param {() => void} fn
 * @returns {() => void} the runner (also used as the subscriber handle)
 */
export function createEffect(fn) {
	const run = () => {
		currentSubscriber = run;
		try {
			fn();
		} finally {
			currentSubscriber = null;
		}
	};
	run();
	return run;
}

/**
 * Cached derivation: recomputes only after a dependency notifies it, and
 * notifies its own readers in turn. `getRuns` exposes the recompute count
 * so tests can assert memoisation.
 * @param {() => any} fn
 * @returns {{ get: () => any, getRuns: () => number }}
 */
export function createMemo(fn) {
	let cached;
	let dirty = true;
	let runs = 0;
	/** @type {Set<() => void>} */
	const listeners = new Set();
	const markDirty = () => {
		dirty = true;
		for (const listener of Array.from(listeners)) listener();
	};
	const compute = () => {
		currentSubscriber = markDirty;
		try {
			cached = fn();
			runs = runs + 1;
		} finally {
			currentSubscriber = null;
		}
		dirty = false;
	};
	compute();
	return {
		get() {
			if (currentSubscriber !== null) listeners.add(currentSubscriber);
			if (dirty) compute();
			return cached;
		},
		getRuns() {
			return runs;
		}
	};
}
