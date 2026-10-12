import { redirect } from '@sveltejs/kit';
import { lessonList } from '#lib/content/notas/lessons.js';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	const id = Number(params.id);
	if (!Number.isInteger(id) || id < 1 || id > lessonList.length) {
		redirect(307, '/');
	}
	return { id };
}
