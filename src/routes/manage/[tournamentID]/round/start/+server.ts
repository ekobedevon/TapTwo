import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';
import type { Insertable } from 'kysely';
import type { Matches, Results } from 'lib/db';
import type { player } from 'lib/types/auth_types';
import { nanoid } from 'nanoid';

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

	console.log(tournament);

	if (tournament) {
		//Start the First Round
		if (tournament.rounds === 0) {
			let players = await db
				.selectFrom('entry')
				.innerJoin('auth_user', 'auth_user.id', 'entry.player')
				.select('auth_user.id')
				.where('entry.tournament', '=', tournament.id)
				.execute();
			let matches: Insertable<Matches>[] = [];
			let results: Insertable<Results>[] = [];

			//Assign a random player the bye for the first round
			if (players.length % 2 === 1) {
				let random = Math.floor(Math.random() * players.length);
				const bye_player = players[random].id;
				const match_id = nanoid();
				matches.push({ id: match_id, a: bye_player, b: bye_player, tournament_id: tournament.id });
				players.splice(random, 1);
				results.push({
					player: bye_player,
					final: 'WIN',
					match: match_id,
					score: 1,
					id: nanoid()
				});
			}

			//Pair off remaining
			while (players.length > 0) {
				let random = Math.floor(Math.random() * players.length);
				const a = players[random].id;
				players.splice(random, 1);
				random = Math.floor(Math.random() * players.length);
				const b = players[random].id;
				const match_id = nanoid();
				players.splice(random, 1);
				matches.push({ id: match_id, a, b, tournament_id: tournament.id });
				results.push(
					{
						player: a,
						final: 'TIE',
						match: match_id,
						score: 0,
						id: nanoid()
					},
					{ player: b, final: 'TIE', match: match_id, score: 0, id: nanoid() }
				);
			}

			await db.insertInto('matches').values(matches).execute();
			await db.updateTable('tournament').set({ rounds: 1 }).execute();
			await db.insertInto('results').values(results).execute();

			return Promise.resolve(
				new Response(JSON.stringify({ message: 'Round 1 Started', matches }), {
					status: 200
				})
			);
		}
	}

	return Promise.resolve(
		new Response(JSON.stringify({ message: 'Rounds Started' }), {
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
