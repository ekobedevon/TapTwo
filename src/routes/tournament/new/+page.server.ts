import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Insertable } from 'kysely';
import type { Tournament } from 'lib/db';
import { nanoid } from 'nanoid';
import { db } from 'db';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/');
};
export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const description = formData.get('description') as string;
		const format = formData.get('format') as string;
		const game = formData.get('game') as string;
		const title = formData.get('title') as string;
		const userId = event.locals.user!.id;
		const newTourney: Insertable<Tournament> = {
			description,
			format,
			game,
			title,
			location: '',
			organizer_id: userId,
			id: nanoid(),
			date: new Date()
		};

		const response = await db.insertInto('tournament').values(newTourney).execute();
		// setSessionTokenCookie(event, token, session.expires_at);
		redirect(302, '/');
	}
};
