/**
 * Course index for Module 1 — Hello, Logic ("Data-Driven Resume") and
 * Module 2 — Reactive Foundations ("Skill Roadmap").
 *
 * Module 1 starts from zero: the learner builds a résumé that renders itself
 * from JavaScript objects and arrays, then makes it searchable and filterable.
 * It is 100% Vanilla HTML/CSS/JS — no frameworks, no bundlers, no Canvas, no
 * Svelte inside the lesson code. It closes with print styles, deployment and
 * an integrative challenge (`type: 'challenge'`).
 *
 * Module 2 builds a skill roadmap in the DOM by hand, then replaces the manual
 * renders with a tiny reactivity engine (signals, effects, memos) built from
 * closures. It closes with a diamond-shaped final boss (`type: 'challenge'`)
 * whose double-run limitation is documented, not fixed, plus an optional
 * advanced milestone and an extension stage.
 *
 * This file ships only lesson *metadata* (id + title + optional type) plus
 * the module and phase tables. The prose and starter code for each lesson
 * live in `./curriculum/lesson-NN.js` and are imported on demand.
 */

export const modules = [
	{
		id: 'hello-logic',
		label: 'Module 1 — Hello, Logic',
		short: 'Module 1 · Hello, Logic',
		project: 'Data-Driven Resume',
		stack: ['HTML5', 'CSS3', 'JavaScript', 'DOM', 'DevTools'],
		pitch:
			'Build a résumé that generates itself from data: first the bones and skin with HTML and CSS, then objects and arrays, then a page that renders itself and responds to search, filters and clicks.',
		description:
			'Five phases turn a static résumé into an app: semantic HTML and Flexbox; variables, objects and arrays of experience; console debugging; DOM selection, template literals and loops; functions, conditionals and addEventListener with filter(), includes() and a restore view. It closes with print styles and deployment.',
		from: 1,
		to: 15
	},
	{
		id: 'roadmap',
		label: 'Module 2 — Reactive Foundations',
		short: 'Module 2 · Reactive Foundations',
		project: 'Skill Roadmap',
		stack: ['JavaScript', 'DOM', 'CSS Grid', 'SVG', 'localStorage'],
		pitch:
			'Plan learning as a skill map with prerequisites: see what you can start today, what blocks you, and how far each branch has come. Then feel why hand-updated views drift, and replace them with a reactivity engine you build yourself.',
		description:
			'Build Skill Roadmap in the DOM first: node objects with prerequisites, derived status with every and switch, manual recalculation, branch progress with map/filter/reduce, layered Grid views with SVG connectors, DFS cycle guards, localStorage persistence and topological suggested order. Part B adds closures, signals, effects and memos — ending on a documented diamond limitation.',
		from: 16,
		to: 32
	}
];

export const phases = [
	{ id: 1, label: 'Phase 1: Bones and Skin', from: 1, to: 2 },
	{ id: 2, label: 'Phase 2: The Brain', from: 3, to: 6 },
	{ id: 3, label: 'Phase 3: The Nervous System', from: 7, to: 9 },
	{ id: 4, label: 'Phase 4: Logic and Interaction', from: 10, to: 13 },
	{ id: 5, label: 'Phase 5: Ship It', from: 14, to: 15 },
	{ id: 6, label: 'Phase 6: Data and the DOM', from: 16, to: 19 },
	{ id: 7, label: 'Phase 7: Progress, Layers and Persistence', from: 20, to: 23 },
	{ id: 8, label: 'Phase 8: Suggested Order and the Pain Point', from: 24, to: 25 },
	{ id: 9, label: 'Phase 9: The Reactivity Engine', from: 26, to: 29 },
	{ id: 10, label: 'Phase 10: Connect, Converge and Ship', from: 30, to: 32 }
];

/** @param {number} lessonId */
export function getPhaseLabel(lessonId) {
	const phase = phases.find((entry) => lessonId >= entry.from && lessonId <= entry.to);
	return phase ? phase.label : '';
}

/** @param {number} lessonId */
export function getModule(lessonId) {
	return modules.find((entry) => lessonId >= entry.from && lessonId <= entry.to);
}

export const lessonList = [
	{ id: 1, title: 'Semantic HTML Bones' },
	{ id: 2, title: 'CSS and Flexbox Skin' },
	{ id: 3, title: 'Variables and Data Types' },
	{ id: 4, title: 'Objects: Model Your Profile' },
	{ id: 5, title: 'Arrays of Objects' },
	{ id: 6, title: 'Debugging Fundamentals' },
	{ id: 7, title: 'Select Elements from the DOM' },
	{ id: 8, title: 'Template Literals' },
	{ id: 9, title: 'Loops That Render' },
	{ id: 10, title: 'Functions: Name the Steps' },
	{ id: 11, title: 'Conditional Logic' },
	{ id: 12, title: 'Events and DOM Updates' },
	{ id: 13, title: 'Integrative challenge: Filter, Search, Restore', type: 'challenge' },
	{ id: 14, title: 'Print and Polish' },
	{ id: 15, title: 'Deploy Your Resume' },
	{ id: 16, title: 'Your First Roadmap' },
	{ id: 17, title: 'Add Nodes and Links' },
	{ id: 18, title: 'Derived Status with every and switch' },
	{ id: 19, title: 'Complete a Skill, Recalculate by Hand' },
	{ id: 20, title: 'Branch and Global Progress' },
	{ id: 21, title: 'Layers with Grid and SVG' },
	{ id: 22, title: 'Forbid Cycles with DFS' },
	{ id: 23, title: 'Persist with localStorage' },
	{ id: 24, title: 'Suggested Order to a Goal', type: 'challenge' },
	{ id: 25, title: 'The Pain Point: Views That Lie' },
	{ id: 26, title: 'Closures and Callbacks' },
	{ id: 27, title: 'createSignal from Scratch' },
	{ id: 28, title: 'createEffect Replaces Manual Render' },
	{ id: 29, title: 'createMemo: Derive, Do Not Recompute' },
	{ id: 30, title: 'Connect the Whole App' },
	{ id: 31, title: 'Final Boss: The Diamond', type: 'challenge' },
	{ id: 32, title: 'Extension Stage: Make It Yours' }
];

/** @type {Record<number, () => Promise<{ default: any }>>} */
const loaders = {
	1: () => import('./curriculum/lesson-01.js'),
	2: () => import('./curriculum/lesson-02.js'),
	3: () => import('./curriculum/lesson-03.js'),
	4: () => import('./curriculum/lesson-04.js'),
	5: () => import('./curriculum/lesson-05.js'),
	6: () => import('./curriculum/lesson-06.js'),
	7: () => import('./curriculum/lesson-07.js'),
	8: () => import('./curriculum/lesson-08.js'),
	9: () => import('./curriculum/lesson-09.js'),
	10: () => import('./curriculum/lesson-10.js'),
	11: () => import('./curriculum/lesson-11.js'),
	12: () => import('./curriculum/lesson-12.js'),
	13: () => import('./curriculum/lesson-13.js'),
	14: () => import('./curriculum/lesson-14.js'),
	15: () => import('./curriculum/lesson-15.js'),
	16: () => import('./curriculum/lesson-16.js'),
	17: () => import('./curriculum/lesson-17.js'),
	18: () => import('./curriculum/lesson-18.js'),
	19: () => import('./curriculum/lesson-19.js'),
	20: () => import('./curriculum/lesson-20.js'),
	21: () => import('./curriculum/lesson-21.js'),
	22: () => import('./curriculum/lesson-22.js'),
	23: () => import('./curriculum/lesson-23.js'),
	24: () => import('./curriculum/lesson-24.js'),
	25: () => import('./curriculum/lesson-25.js'),
	26: () => import('./curriculum/lesson-26.js'),
	27: () => import('./curriculum/lesson-27.js'),
	28: () => import('./curriculum/lesson-28.js'),
	29: () => import('./curriculum/lesson-29.js'),
	30: () => import('./curriculum/lesson-30.js'),
	31: () => import('./curriculum/lesson-31.js'),
	32: () => import('./curriculum/lesson-32.js')
};

/** @param {number} id */
export async function loadLesson(id) {
	const loader = loaders[id];
	if (!loader) throw new Error(`Unknown lesson id: ${id}`);
	const module = await loader();
	return module.default;
}

export function loadAllLessons() {
	return Promise.all(lessonList.map((lesson) => loadLesson(lesson.id)));
}
