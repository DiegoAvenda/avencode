/**
 * Progress mirror for logged-in learners.
 *
 * - GET returns the stored payload (sanitised) or a fresh default.
 * - PUT replaces it with the client payload (sanitised server-side).
 *
 * Anonymous callers get 401; the client keeps working on its localStorage
 * cache in that case. Lab layout preferences are never accepted here.
 */

import { json } from '@sveltejs/kit';
import { auth } from '$lib/server/auth.js';
import { getDb } from '$lib/server/db.js';
import { migrateToCurrent } from '$lib/stores/progressMigrations.js';

/** Reject absurd payloads before they reach the database. */
const MAX_BODY_BYTES = 400_000;

/** @param {import('@sveltejs/kit').RequestEvent} event */
async function requireUser(event) {
	const session = await auth.api.getSession({ headers: event.request.headers });
	return session?.user ?? null;
}

/** @param {import('@sveltejs/kit').RequestEvent} event */
export async function GET(event) {
	const user = await requireUser(event);
	if (!user) return json({ error: 'unauthorized' }, { status: 401 });

	const db = await getDb();
	const doc = await db.collection('progress').findOne({ userId: user.id });
	if (!doc) {
		return json({ currentLesson: 1, completedLessons: [], editorContents: {}, updatedAt: 0 });
	}
	const clean = migrateToCurrent(doc);
	return json({
		...clean,
		updatedAt: typeof doc.updatedAt === 'number' ? doc.updatedAt : 0
	});
}

/** @param {import('@sveltejs/kit').RequestEvent} event */
export async function PUT(event) {
	const user = await requireUser(event);
	if (!user) return json({ error: 'unauthorized' }, { status: 401 });

	let raw;
	try {
		raw = await event.request.json();
	} catch {
		return json({ error: 'invalid JSON' }, { status: 400 });
	}
	if (JSON.stringify(raw)?.length > MAX_BODY_BYTES) {
		return json({ error: 'payload too large' }, { status: 413 });
	}

	const clean = migrateToCurrent(raw);
	const updatedAt = Date.now();
	const db = await getDb();
	await db
		.collection('progress')
		.updateOne(
			{ userId: user.id },
			{ $set: { userId: user.id, ...clean, updatedAt } },
			{ upsert: true }
		);
	return json({ ok: true, updatedAt });
}
