/**
 * Course index for Module 0 — Foundations ("Skill Roadmap").
 *
 * The learner builds a skill roadmap in 100% Vanilla HTML/CSS/JS: no
 * frameworks, no bundlers, no Canvas (layers use CSS Grid, connectors use
 * SVG), no Svelte inside the lesson code. Part A renders everything by
 * hand-manipulating the DOM; Part B replaces the manual renders with a tiny
 * reactivity engine (signals, effects, memos) the learner builds from
 * closures. The module closes with a diamond-shaped final boss (`type:
 * 'challenge'`) whose double-run limitation is documented, not fixed, plus an
 * optional advanced milestone (lesson 9) and an extension stage (lesson 17).
 *
 * This file ships only lesson *metadata* (id + title + optional type) plus
 * the module and phase tables. The prose and starter code for each lesson
 * live in `./curriculum/lesson-NN.js` and are imported on demand.
 */

export const modules = [
	{
		id: 'roadmap',
		label: 'Module 0 — Foundations',
		short: 'Module 0 · Foundations',
		project: 'Skill Roadmap',
		stack: ['JavaScript', 'DOM', 'CSS Grid', 'SVG', 'localStorage'],
		pitch:
			'Plan learning as a skill map with prerequisites: see what you can start today, what blocks you, and how far each branch has come. Then feel why hand-updated views drift, and replace them with a reactivity engine you build yourself.',
		description:
			'Build Skill Roadmap in the DOM first: node objects with prerequisites, derived status with every and switch, manual recalculation, branch progress with map/filter/reduce, layered Grid views with SVG connectors, DFS cycle guards, localStorage persistence and topological suggested order. Part B adds closures, signals, effects and memos — ending on a documented diamond limitation.',
		from: 1,
		to: 17
	}
];

export const phases = [
	{ id: 1, label: 'Phase 1: Data and the DOM', from: 1, to: 4 },
	{ id: 2, label: 'Phase 2: Progress, Layers and Persistence', from: 5, to: 8 },
	{ id: 3, label: 'Phase 3: Suggested Order and the Pain Point', from: 9, to: 10 },
	{ id: 4, label: 'Phase 4: The Reactivity Engine', from: 11, to: 14 },
	{ id: 5, label: 'Phase 5: Connect, Converge and Ship', from: 15, to: 17 }
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
	{ id: 1, title: 'Your First Roadmap' },
	{ id: 2, title: 'Add Nodes and Links' },
	{ id: 3, title: 'Derived Status with every and switch' },
	{ id: 4, title: 'Complete a Skill, Recalculate by Hand' },
	{ id: 5, title: 'Branch and Global Progress' },
	{ id: 6, title: 'Layers with Grid and SVG' },
	{ id: 7, title: 'Forbid Cycles with DFS' },
	{ id: 8, title: 'Persist with localStorage' },
	{ id: 9, title: 'Suggested Order to a Goal', type: 'challenge' },
	{ id: 10, title: 'The Pain Point: Views That Lie' },
	{ id: 11, title: 'Closures and Callbacks' },
	{ id: 12, title: 'createSignal from Scratch' },
	{ id: 13, title: 'createEffect Replaces Manual Render' },
	{ id: 14, title: 'createMemo: Derive, Do Not Recompute' },
	{ id: 15, title: 'Connect the Whole App' },
	{ id: 16, title: 'Final Boss: The Diamond', type: 'challenge' },
	{ id: 17, title: 'Extension Stage: Make It Yours' }
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
	17: () => import('./curriculum/lesson-17.js')
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
