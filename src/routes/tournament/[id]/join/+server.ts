import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';

export const POST = async (event: RequestEvent): Promise<Response> => {
	if (!event.locals.user || !event.params.tournamentID) redirect(302, '/');

	const tournamentID: string = event.params.tournamentID;

	const response = await db
		.insertInto('entry')
		.values({ tournament: tournamentID, player: event.locals.user.id })
		.returningAll()
		.executeTakeFirst();
	if (!response) {
		return Promise.resolve(
			new Response(JSON.stringify({ message: 'Failed to Join, try again in a little' }), {
				status: 500
			})
		);
	}

	return Promise.resolve(
		new Response(JSON.stringify({ message: 'Tournament Joined' }), {
			status: 200
		})
	);
};
