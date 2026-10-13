import assert from 'node:assert/strict';
import test from 'node:test';

import {
	MAX_LESSON_ID,
	STORAGE_VERSION,
	mapProgress,
	migrateToCurrent,
	sanitizeProgress
} from '../src/lib/stores/progressMigrations.js';
import { lessonList } from '../src/lib/content/roadmap/lessons.js';

test('the storage version is 2 for the Skill Roadmap curriculum', () => {
	assert.equal(STORAGE_VERSION, 2);
});

test('the lesson bound matches the shipped curriculum', () => {
	assert.equal(MAX_LESSON_ID, lessonList.length);
});

test('empty and corrupt payloads fall back to sensible defaults', () => {
	assert.deepEqual(sanitizeProgress(null), {
		currentLesson: 1,
		completedLessons: [],
		editorContents: {}
	});
	assert.deepEqual(sanitizeProgress({}), {
		currentLesson: 1,
		completedLessons: [],
		editorContents: {}
	});
	assert.deepEqual(sanitizeProgress('nonsense'), {
		currentLesson: 1,
		completedLessons: [],
		editorContents: {}
	});
});

test('out-of-range lessons are dropped while readable fields survive', () => {
	const clean = sanitizeProgress({
		currentLesson: 99,
		completedLessons: [1, 2, 99, -3, 'oops'],
		editorContents: {
			1: { html: 'a', css: 'b', javascript: 'c' },
			99: { html: 'a', css: 'b', javascript: 'c' },
			broken: { html: 'a' }
		}
	});

	assert.equal(clean.currentLesson, 1);
	assert.deepEqual(clean.completedLessons, [1, 2]);
	assert.deepEqual(clean.editorContents, { 1: { html: 'a', css: 'b', javascript: 'c' } });
});

test('a valid payload round-trips untouched', () => {
	const payload = {
		currentLesson: 5,
		completedLessons: [3, 1, 3],
		editorContents: { 2: { html: '<p></p>', css: 'p {}', javascript: '1;' } }
	};
	assert.deepEqual(sanitizeProgress(payload), {
		currentLesson: 5,
		completedLessons: [1, 3],
		editorContents: { 2: { html: '<p></p>', css: 'p {}', javascript: '1;' } }
	});
});

test('mapProgress remaps every lesson reference for future migrations', () => {
	const shifted = mapProgress(
		{
			currentLesson: 3,
			completedLessons: [1, 3],
			editorContents: { 3: 'code', 'not-a-number': 'kept' }
		},
		(id) => id + 10
	);

	assert.equal(shifted.currentLesson, 13);
	assert.deepEqual(shifted.completedLessons, [11, 13]);
	assert.deepEqual(shifted.editorContents, { 13: 'code', 'not-a-number': 'kept' });
});

test('migrateToCurrent keeps what is readable on unknown versions', () => {
	const migrated = migrateToCurrent({
		version: 999,
		currentLesson: 4,
		completedLessons: [4],
		editorContents: {}
	});
	assert.equal(migrated.currentLesson, 4);
	assert.deepEqual(migrated.completedLessons, [4]);
});

test('previous-curriculum payloads (v1 or version-less) reset to fresh defaults', () => {
	const fresh = { currentLesson: 1, completedLessons: [], editorContents: {} };
	assert.deepEqual(
		migrateToCurrent({
			version: 1,
			currentLesson: 9,
			completedLessons: [1, 9],
			editorContents: { 9: { html: 'a', css: 'b', javascript: 'c' } }
		}),
		fresh
	);
	assert.deepEqual(
		migrateToCurrent({
			currentLesson: 5,
			completedLessons: [5],
			editorContents: {}
		}),
		fresh,
		'server mirrors never carried a version, so missing version means v1'
	);
	assert.deepEqual(migrateToCurrent(fresh), fresh, 'migration is idempotent');
});

test('a current-version payload round-trips through the migration', () => {
	assert.deepEqual(
		migrateToCurrent({
			version: 2,
			currentLesson: 11,
			completedLessons: [10],
			editorContents: {}
		}),
		{ currentLesson: 11, completedLessons: [10], editorContents: {} }
	);
});
