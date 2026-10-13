import assert from 'node:assert/strict';
import test from 'node:test';

import {
	branchProgress,
	computeDepth,
	createEffect,
	createMemo,
	createSignal,
	getStatus,
	globalProgress,
	nextSteps,
	topoOrder,
	wouldCreateCycle
} from '../src/lib/content/roadmap/engine.js';

// A small web-dev roadmap: html is done, css is in progress, js waits on css,
// dom waits on html AND js (multiple prerequisites), events waits on dom.
const nodes = () => [
	{ id: 'html', title: 'HTML Basics', status: 'done', prerequisites: [], branch: 'Markup' },
	{
		id: 'css',
		title: 'CSS Basics',
		status: 'in-progress',
		prerequisites: ['html'],
		branch: 'Styling'
	},
	{ id: 'js', title: 'JS Basics', status: 'todo', prerequisites: ['css'], branch: 'Scripting' },
	{
		id: 'dom',
		title: 'DOM Intro',
		status: 'todo',
		prerequisites: ['html', 'js'],
		branch: 'Scripting'
	},
	{ id: 'events', title: 'Events', status: 'todo', prerequisites: ['dom'], branch: 'Scripting' }
];

test('derived states: done, in-progress, blocked and ready', () => {
	const list = nodes();
	const byId = Object.fromEntries(list.map((node) => [node.id, node]));
	assert.equal(getStatus(byId.html, list), 'done');
	assert.equal(getStatus(byId.css, list), 'in-progress');
	assert.equal(getStatus(byId.js, list), 'blocked');
	assert.equal(getStatus(byId.dom, list), 'blocked');
});

test('a node with every prerequisite done is ready, even with several', () => {
	const list = nodes();
	const ready = [
		{ id: 'a', title: 'A', status: 'done', prerequisites: [] },
		{ id: 'b', title: 'B', status: 'done', prerequisites: [] },
		{ id: 'c', title: 'C', status: 'todo', prerequisites: ['a', 'b'] }
	];
	assert.equal(getStatus(ready[2], ready), 'ready');
	assert.deepEqual(
		nextSteps(list).map((node) => node.id),
		[],
		'no todo node is fully unblocked in the seed graph'
	);
	assert.deepEqual(
		nextSteps(ready).map((node) => node.id),
		['c']
	);
});

test('an unknown prerequisite keeps its dependent blocked', () => {
	const list = [{ id: 'x', title: 'X', status: 'todo', prerequisites: ['ghost'] }];
	assert.equal(getStatus(list[0], list), 'blocked');
});

test('cycle detection refuses self-edges, back-edges and longer loops', () => {
	const list = nodes();
	assert.equal(wouldCreateCycle(list, 'html', 'html'), true, 'self-edge is a cycle');
	assert.equal(
		wouldCreateCycle(list, 'html', 'events'),
		true,
		'html is reachable from events, so requiring it back would loop'
	);
	assert.equal(wouldCreateCycle(list, 'events', 'html'), false, 'forward edge is safe');
	assert.equal(wouldCreateCycle(list, 'css', 'events'), true, 'css sits upstream of events');
});

test('layer depth is one past the deepest prerequisite', () => {
	assert.deepEqual(computeDepth(nodes()), { html: 0, css: 1, js: 2, dom: 3, events: 4 });
	assert.deepEqual(computeDepth([]), {});
});

test('suggested order lists prerequisites first and ends at the goal', () => {
	const order = topoOrder(nodes(), 'events');
	assert.equal(order[order.length - 1], 'events');
	assert.ok(order.indexOf('html') < order.indexOf('dom'));
	assert.ok(order.indexOf('js') < order.indexOf('dom'));
	assert.ok(order.indexOf('dom') < order.indexOf('events'));
	assert.deepEqual(topoOrder(nodes(), 'html'), ['html']);
});

test('branch and global progress count done nodes with map/filter math', () => {
	assert.deepEqual(branchProgress(nodes(), 'Scripting'), { total: 3, done: 0, percent: 0 });
	assert.deepEqual(branchProgress(nodes(), 'Markup'), { total: 1, done: 1, percent: 100 });
	assert.deepEqual(branchProgress(nodes(), 'Missing'), { total: 0, done: 0, percent: 0 });
	assert.deepEqual(globalProgress(nodes()), { total: 5, done: 1, percent: 20 });
});

test('a signal notifies every subscriber when its value changes', () => {
	const signal = createSignal(1);
	const seen = [];
	const stopA = signal.subscribe(() => seen.push('a'));
	signal.subscribe(() => seen.push('b'));
	signal.set(2);
	assert.deepEqual(seen, ['a', 'b']);
	signal.set(2);
	assert.deepEqual(seen, ['a', 'b'], 'setting the same value notifies nobody');
	stopA();
	signal.set(3);
	assert.deepEqual(seen, ['a', 'b', 'b']);
});

test('an effect runs once and re-runs on every dependency change', () => {
	const name = createSignal('Ada');
	const runs = [];
	createEffect(() => runs.push('Hello, ' + name.get() + '!'));
	assert.deepEqual(runs, ['Hello, Ada!']);
	name.set('Grace');
	assert.deepEqual(runs, ['Hello, Ada!', 'Hello, Grace!']);
});

test('a memo caches its value and skips recompute without changes', () => {
	const count = createSignal(2);
	const doubled = createMemo(() => count.get() * 2);
	assert.equal(doubled.get(), 4);
	assert.equal(doubled.get(), 4);
	assert.equal(doubled.getRuns(), 1, 'repeated reads must not recompute');
	count.set(3);
	assert.equal(doubled.get(), 6);
	assert.equal(doubled.getRuns(), 2);
});

test('KNOWN LIMITATION: in a diamond the effect runs twice and sees mixed state', () => {
	// Diamond: source S feeds branches A and B, which converge on effect C.
	// This engine notifies depth-first with no topological ordering, so when
	// S changes, A recomputes and wakes C before B has recomputed: C first
	// observes (new A, stale B), then (new A, new B). Lesson 16 teaches this
	// as the documented limitation; Module 1 fixes it with ordered recalc.
	const source = createSignal(1);
	const left = createMemo(() => source.get() * 10);
	const right = createMemo(() => source.get() * 100);
	/** @type {Array<[number, number]>} */
	const snapshots = [];
	createEffect(() => snapshots.push([left.get(), right.get()]));
	assert.deepEqual(snapshots, [[10, 100]]);
	source.set(2);
	assert.equal(snapshots.length, 3, 'the effect must run twice per source change');
	assert.deepEqual(snapshots[1], [20, 100], 'first run mixes the new left with the stale right');
	assert.deepEqual(snapshots[2], [20, 200], 'second run converges once both branches settle');
});
