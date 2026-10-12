import assert from 'node:assert/strict';
import test from 'node:test';

import {
	MAX_LESSON_ID,
	STORAGE_VERSION,
	mapProgress,
	migrateToCurrent,
	sanitizeProgress
} from '../src/lib/stores/progressMigrations.js';
import { lessonList } from '../src/lib/content/notas/lessons.js';

test('the storage version starts at 1 for the new curriculum', () => {
	assert.equal(STORAGE_VERSION, 1);
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
