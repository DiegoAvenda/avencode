/**
 * Course index for Module 0 — Foundations ("Quick Notes").
 *
 * The learner builds a notes app in 100% Vanilla HTML/CSS/JS: no frameworks,
 * no bundlers, no Svelte inside the lesson code. The module closes with a
 * challenge lesson (`type: 'challenge'`) and an interview-style close.
 *
 * This file ships only lesson *metadata* (id + title + optional type) plus
 * the module and phase tables. The prose and starter code for each lesson
 * live in `./curriculum/lesson-NN.js` and are imported on demand.
 */

export const modules = [
	{
		id: 'onramp',
		label: 'Module 0 — Foundations',
		short: 'Module 0 · Foundations',
		project: 'Quick Notes',
		stack: ['JavaScript', 'DOM', 'CSS', 'localStorage'],
		pitch:
			'Build a notes app note by note, starting with your first program. Learn to run code, structure a page, style it with pure CSS, answer clicks and keep state before the app grows persistence and an undo stack.',
		description:
			'Build Quick Notes in the DOM first: semantic HTML, a Flexbox/Grid layout, element creation, events, an array of note objects with render-on-change, localStorage persistence and an undo stack built on push and pop (LIFO).',
		from: 1,
		to: 12
	}
];

export const phases = [
	{ id: 1, label: 'Phase 1: Foundations (HTML, CSS and the console)', from: 1, to: 3 },
	{ id: 2, label: 'Phase 2: Build It Interactive (DOM, events and render)', from: 4, to: 8 },
	{ id: 3, label: 'Phase 3: Persistence and the Undo Stack', from: 9, to: 10 },
	{ id: 4, label: 'Phase 4: Challenge and Close', from: 11, to: 12 }
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
	{ id: 1, title: 'Run Your First Program' },
	{ id: 2, title: 'HTML Semantics for Notes' },
	{ id: 3, title: 'Pure CSS Layout' },
	{ id: 4, title: 'Select from the DOM' },
	{ id: 5, title: 'Create Elements' },
	{ id: 6, title: 'Listen to Clicks' },
	{ id: 7, title: 'Arrays and Objects as State' },
	{ id: 8, title: 'Delete and Render' },
	{ id: 9, title: 'Persist with localStorage' },
	{ id: 10, title: 'Undo with a Stack' },
	{ id: 11, title: 'Multi-Undo Checker', type: 'challenge' },
	{ id: 12, title: 'Project Close: Interview Room' }
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
	12: () => import('./curriculum/lesson-12.js')
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
