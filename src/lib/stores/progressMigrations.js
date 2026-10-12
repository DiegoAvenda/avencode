/**
 * Progress payload format and migrations.
 *
 * Progress is cached in localStorage under STORAGE_KEY and, for logged-in
 * learners, mirrored to MongoDB through `/api/progress` (see
 * `progress.svelte.js`). Every payload carries a `version` field so lesson
 * renumbering can ship a migration instead of wiping learner work.
 *
 * This curriculum starts at STORAGE_VERSION 1. If lessons are ever
 * renumbered, inserted or moved: add a `shiftProgressToVN` function below,
 * chain it in `migrateToCurrent`, and bump STORAGE_VERSION. Never drop a
 * payload you cannot interpret; keep what is readable.
 *
 * Lab layout preferences live in `labLayout.js` under their own key and are
 * never merged into this payload.
 */

export const STORAGE_KEY = 'avencode-progress';
export const STORAGE_VERSION = 1;

/** Highest lesson id of Module 0. Importing lessons.js here would pull the
 * whole curriculum into server bundles, so the bound is duplicated and
 * asserted by `tests/progress.test.js`. */
export const MAX_LESSON_ID = 12;

/**
 * Remap every lesson reference inside a progress payload.
 * @param {{ currentLesson?: unknown, completedLessons?: unknown, editorContents?: unknown }} parsed
 * @param {(id: number) => number} mapId
 */
export function mapProgress(parsed, mapId) {
	const completedLessons = [
		...new Set(
			(Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [])
				.map((id) => Number(id))
				.filter((id) => Number.isInteger(id))
				.map((id) => mapId(id))
		)
	];
	const rawCurrent = Number(parsed.currentLesson);
	const currentLesson = Number.isInteger(rawCurrent) ? mapId(rawCurrent) : 1;
	/** @type {Record<string, unknown>} */
	const editorContents = {};
	const source =
		parsed.editorContents && typeof parsed.editorContents === 'object' ? parsed.editorContents : {};
	for (const [key, value] of Object.entries(source)) {
		const lessonId = Number.parseInt(key, 10);
		editorContents[Number.isNaN(lessonId) ? key : String(mapId(lessonId))] = value;
	}
	return { currentLesson, completedLessons, editorContents };
}

/**
 * @param {unknown} value
 * @returns {value is { html: unknown, css: unknown, javascript: unknown }}
 */
function isCodeSnapshot(value) {
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	const snapshot = /** @type {Record<string, unknown>} */ (value);
	return ['html', 'css', 'javascript'].every((tab) => typeof snapshot[tab] === 'string');
}

/**
 * Turn anything that came out of storage into a usable progress object.
 * Missing, partial or corrupt input falls back to the defaults field by
 * field, so one bad field never wipes the readable rest.
 *
 * @param {unknown} raw
 */
export function sanitizeProgress(raw) {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
		return { currentLesson: 1, completedLessons: [], editorContents: {} };
	}
	const parsed = /** @type {Record<string, unknown>} */ (raw);

	let currentLesson = Number(parsed.currentLesson);
	if (!Number.isInteger(currentLesson) || currentLesson < 1 || currentLesson > MAX_LESSON_ID) {
		currentLesson = 1;
	}

	const completedLessons = [
		...new Set(
			(Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [])
				.map((id) => Number(id))
				.filter((id) => Number.isInteger(id) && id >= 1 && id <= MAX_LESSON_ID)
		)
	].sort((a, b) => a - b);

	/** @type {Record<string, { html: string, css: string, javascript: string }>} */
	const editorContents = {};
	const source =
		parsed.editorContents && typeof parsed.editorContents === 'object'
			? /** @type {Record<string, unknown>} */ (parsed.editorContents)
			: {};
	for (const [key, value] of Object.entries(source)) {
		const lessonId = Number.parseInt(key, 10);
		if (Number.isNaN(lessonId) || lessonId < 1 || lessonId > MAX_LESSON_ID) continue;
		if (!isCodeSnapshot(value)) continue;
		const snapshot = /** @type {Record<string, string>} */ (/** @type {unknown} */ (value));
		editorContents[key] = {
			html: snapshot.html,
			css: snapshot.css,
			javascript: snapshot.javascript
		};
	}

	return { currentLesson, completedLessons, editorContents };
}

/**
 * Bring any stored payload up to the current version, then sanitise it.
 * @param {unknown} raw
 */
export function migrateToCurrent(raw) {
	if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return sanitizeProgress(null);
	const parsed = /** @type {Record<string, unknown>} */ (raw);
	if (parsed.version === undefined || parsed.version === STORAGE_VERSION) {
		return sanitizeProgress(parsed);
	}
	// Unknown future or past version: keep whatever is still readable.
	return sanitizeProgress(parsed);
}
