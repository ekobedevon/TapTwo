import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';

export const POST = async (event: RequestEvent): Promise<Response> => {
	if (!event.locals.user || !event.params.tournamentID) redirect(302, '/');

	const tournamentID: string = event.params.tournamentID;

	const tournament = await db
		.selectFrom('tournament')
		.selectAll()
		.where('id', '=', tournamentID)
		.where('organizer_id', '=', event.locals.user.id)
		.executeTakeFirst();

	if (tournament) {
		const activeMatches = await db
			.selectFrom('matches')
			.where('matches.tournament_id', '=', tournamentID)
			.where('matches.round', '=', tournament.rounds)
			.where('matches.finished', '=', false)
			.execute();

		return Promise.resolve(
			new Response(JSON.stringify({ active: activeMatches.length !== 0 }), {
				status: 200
			})
		);
	}

	// Failure Promise
	return Promise.resolve(
		new Response(JSON.stringify({ message: 'Tournament does not exist' }), {
			status: 500
		})
	);
};

// Failure Promise
// if (!response) {
// 	return Promise.resolve(
// 		new Response(JSON.stringify({ message: 'Failed to add new player, try again' }), {
// 			status: 500
// 		})
// 	);
// }
