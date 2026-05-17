import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';

export const DELETE = async (event: RequestEvent): Promise<Response> => {
	if (!event.locals.user || !event.params.tournamentID) {
		return Promise.resolve(
			new Response(JSON.stringify({ message: 'You must be logged in!' }), {
				status: 401
			})
		);
	}
	const body: any = await event.request.json();
	console.log(body);

	const tournamentID: string = event.params.tournamentID;

	const tournament = await db
		.selectFrom('tournament')
		.where('id', '=', tournamentID)
		.where('organizer_id', '=', event.locals.user.id)
		.selectAll()
		.executeTakeFirst();

	if (!tournament) {
		return Promise.resolve(
			new Response(JSON.stringify({ message: 'Tournament does not exist!' }), {
				status: 401
			})
		);
	}
	//if tournament hasn't started, player can be removed, otherwise they are dropped
	if (tournament.rounds === 0) {
		const entry = await db
			.deleteFrom('entry')
			.where('entry.tournament', '=', tournament.id)
			.where('entry.player', '=', body.userID)
			.executeTakeFirst();
	} else {
		const entry = await db
			.updateTable('entry')
			.set({ status: 'DROP' })
			.where('entry.tournament', '=', tournament.id)
			.where('entry.player', '=', body.userID)
			.executeTakeFirst();
	}
	

	return Promise.resolve(
		new Response(JSON.stringify({ message: 'Player Deleted' }), {
			status: 200
		})
	);
};
