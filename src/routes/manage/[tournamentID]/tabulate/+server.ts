import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';
import type { Insertable } from 'kysely';
import type { Entry } from 'lib/db';

export const POST = async (event: RequestEvent): Promise<Response> => {
	if (!event.locals.user || !event.params.tournamentID) redirect(302, '/');

	const body: any = await event.request.json();
	const userID: string = body.userID;
	const tournamentID: string = event.params.tournamentID;

	const tournament = await db
		.selectFrom('tournament')
		.selectAll()
		.where('id', '=', tournamentID)
		.where('organizer_id', '=', event.locals.user.id)
		.executeTakeFirst();

	if (tournament) {
		const players = await db
			.selectFrom('entry')
			.select(['entry.player'])
			.where('entry.tournament', '=', tournamentID)
			.execute();

		const results = await db
			.selectFrom('entry')
			.innerJoin('results', 'results.player', 'entry.player')
			.select(['results.player', 'results.final'])
			.where('entry.tournament', '=', tournamentID)
			.execute();

		let scores: Record<string, number> = {};

		for (let index = 0; index < results.length; index++) {
			if (scores[results[index].player] == undefined) {
				scores[results[index].player] = 0;
			}

			if (results[index].final == 'DRAW') {
				scores[results[index].player] += 5; //.5 points for a tie scale for int
			}
			if (results[index].final == 'WIN') {
				scores[results[index].player] += 10; //.5 points for a tie scale for int
			}
		}
		console.log(scores);
		for (let index = 0; index < players.length; index++) {
			console.log(`Updating ${scores[players[index].player]}`);
			await db
				.updateTable('entry')
				.where('entry.tournament', '=', tournament.id)
				.where('entry.player', '=', players[index].player)
				.set({ points: scores[players[index].player] })
				.execute();
		}
		console.log('Done');
		return Promise.resolve(
			new Response(JSON.stringify({ message: 'Retabulation Complete, refresh page' }), {
				status: 200
			})
		);
	}

	return Promise.resolve(
		new Response(JSON.stringify({ message: 'Player Added' }), {
			status: 200
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
