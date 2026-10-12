/**
 * Learner progress: localStorage cache mirrored to MongoDB for logged-in
 * learners (via `/api/progress`, keyed by the Better Auth session).
 *
 * Rules:
 * - localStorage is the source of truth for rendering; the server mirror is
 *   best-effort and must never block the UI.
 * - Everything read (local or remote) goes through `migrateToCurrent`, so a
 *   hand-edited or outdated payload cannot break the app.
 * - Lab layout preferences live in `labLayout.js` and are never merged into
 *   this payload.
 */

import { STORAGE_KEY, STORAGE_VERSION, migrateToCurrent } from './progressMigrations.js';

/** @param {string | null} raw */
function safeParse(raw) {
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		return null;
	}
}

function defaultProgress() {
	return { currentLesson: 1, completedLessons: [], editorContents: {}, updatedAt: 0 };
}

function readLocal() {
	const fallback = defaultProgress();
	try {
		if (typeof localStorage === 'undefined') return fallback;
		const parsed = safeParse(localStorage.getItem(STORAGE_KEY));
		if (!parsed) return fallback;
		const migrated = migrateToCurrent(parsed);
		return {
			...migrated,
			updatedAt: typeof parsed.updatedAt === 'number' ? parsed.updatedAt : 0
		};
	} catch {
		return fallback;
	}
}

/** @param {{ currentLesson: number, completedLessons: number[], editorContents: Record<string, unknown>, updatedAt: number }} data */
function writeLocal(data) {
	const payload = { version: STORAGE_VERSION, ...data };
	try {
		if (typeof localStorage === 'undefined') return;
		localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
	} catch {
		// Storage full or blocked (private mode): the in-memory state still works.
	}
}

export function createProgressStore() {
	const initial = readLocal();

	let currentLesson = $state(initial.currentLesson);
	let completedLessons = $state(initial.completedLessons);
	let editorContents = $state(initial.editorContents);
	let updatedAt = $state(initial.updatedAt);
	/** Becomes true after a successful pull; pushes only run from then on. */
	let remoteEnabled = $state(false);
	/** @type {ReturnType<typeof setTimeout> | undefined} */
	let pushTimer;

	function snapshot() {
		return { currentLesson, completedLessons, editorContents, updatedAt };
	}

	function persist() {
		updatedAt = Date.now();
		writeLocal(snapshot());
		schedulePush();
	}

	function schedulePush() {
		if (typeof window === 'undefined') return;
		clearTimeout(pushTimer);
		pushTimer = setTimeout(pushToServer, 800);
	}

	async function pushToServer() {
		pushTimer = undefined;
		if (!remoteEnabled) return;
		try {
			const response = await fetch('/api/progress', {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(snapshot())
			});
			if (response.status === 401) remoteEnabled = false;
		} catch {
			// Offline or server error: the local cache still has everything.
		}
	}

	return {
		get currentLesson() {
			return currentLesson;
		},
		set currentLesson(value) {
			currentLesson = value;
			persist();
		},
		get completedLessons() {
			return completedLessons;
		},
		get remoteEnabled() {
			return remoteEnabled;
		},
		markCompleted(id) {
			if (!completedLessons.includes(id)) {
				completedLessons = [...completedLessons, id];
				persist();
			}
		},
		unmarkCompleted(id) {
			if (completedLessons.includes(id)) {
				completedLessons = completedLessons.filter((entry) => entry !== id);
				persist();
			}
		},
		toggleCompleted(id) {
			if (completedLessons.includes(id)) {
				completedLessons = completedLessons.filter((entry) => entry !== id);
			} else {
				completedLessons = [...completedLessons, id];
			}
			persist();
		},
		isCompleted(id) {
			return completedLessons.includes(id);
		},
		saveEditorContents(lessonId, code) {
			editorContents = { ...editorContents, [lessonId]: code };
			persist();
		},
		getEditorContents(lessonId) {
			return editorContents[lessonId] || null;
		},
		clearEditorContents(lessonId) {
			if (!(lessonId in editorContents)) return;
			const next = { ...editorContents };
			delete next[lessonId];
			editorContents = next;
			persist();
		},
		/**
		 * Pull the server mirror (logged-in learners only) and adopt it when
		 * it is newer than the local cache. Call once from `onMount`.
		 */
		async pullFromServer() {
			try {
				const response = await fetch('/api/progress');
				if (response.status === 401) {
					remoteEnabled = false;
					return;
				}
				if (!response.ok) return;
				remoteEnabled = true;
				const raw = await response.json();
				const remote = migrateToCurrent(raw);
				const remoteUpdatedAt = typeof raw.updatedAt === 'number' ? raw.updatedAt : 0;
				if (remoteUpdatedAt > updatedAt) {
					currentLesson = remote.currentLesson;
					completedLessons = remote.completedLessons;
					editorContents = remote.editorContents;
					updatedAt = remoteUpdatedAt;
					writeLocal(snapshot());
				} else if (remoteUpdatedAt < updatedAt) {
					schedulePush();
				}
			} catch {
				// Offline: stay on the local cache.
			}
		}
	};
}
