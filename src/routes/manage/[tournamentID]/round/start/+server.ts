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

	if (tournament) {
		//Start the First Round
		const newRound = tournament.rounds + 1;
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
				matches.push({
					id: match_id,
					a: bye_player,
					b: bye_player,
					tournament_id: tournament.id,
					round: newRound
				});
				players.splice(random, 1);
				results.push({
					player: bye_player,
					final: 'WIN',
					match: match_id,
					score: 0,
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
				matches.push({ id: match_id, a, b, tournament_id: tournament.id, round: newRound });
				results.push(
					{
						player: a,
						final: 'DRAW',
						match: match_id,
						score: 0,
						id: nanoid()
					},
					{ player: b, final: 'DRAW', match: match_id, score: 0, id: nanoid() }
				);
			}

			await db.insertInto('matches').values(matches).execute();
			await db.updateTable('tournament').set({ rounds: newRound }).execute();
			await db.insertInto('results').values(results).execute();

			return Promise.resolve(
				new Response(JSON.stringify({ message: 'Round 1 Started', matches }), {
					status: 200
				})
			);
		} else {
			let players = await db
				.selectFrom('entry')
				.innerJoin('auth_user', 'auth_user.id', 'entry.player')
				.select(['auth_user.id', 'entry.points'])
				.where('entry.tournament', '=', tournament.id)
				.orderBy('points', 'desc')
				.execute();
			let matches: Insertable<Matches>[] = [];
			let results: Insertable<Results>[] = [];
			//If there is an uneven amount of players
			if (players.length % 2 === 1) {
				let index = players.length - 1;
				while (players.length % 2 == 1) {
					const byes = await db
						.selectFrom('matches')
						.where('tournament_id', '=', tournament.id)
						.where('a', '=', players[index].id)
						.where('b', '=', players[index].id)
						.executeTakeFirst();
					// if the player has no previous bye rounds then then get the bye
					if (!byes) {
						const match_id = nanoid();
						const bye_player = players[index].id;
						matches.push({
							id: match_id,
							a: bye_player,
							b: bye_player,
							tournament_id: tournament.id,
							round: newRound
						});
						players.splice(index, 1); // remove from array so that its even
						results.push({
							player: bye_player,
							final: 'WIN',
							match: match_id,
							score: 0,
							id: nanoid()
						});
					}
				}
			}

			let carry:
				| {
						id: string;
						points: number;
				  }
				| undefined = undefined;
			for (let ranking = players[0].points; ranking >= 0; ranking--) {
				let rank: {
					id: string;
					points: number;
				}[] = [];
				if (carry) {
					rank.push(carry);
					carry = undefined;
				}
				//Starting from the players with the most points make a list
				for (let index = players.length - 1; index >= 0; index--) {
					//If of this rank add to this list
					if (players[index].points === ranking) {
						rank.push(players[index]);
						players.splice(index, 1);
					}
				}
				//If there is an un even amount of people
				if (rank.length % 2 === 1) {
					carry = rank.pop(); // remove bottom ranked from the group
				}
				//pair off
				const offset = rank.length / 2;
				for (let index = 0; index < offset; index++) {
					const match_id = nanoid();
					const a = rank[index + offset].id;
					const b = rank[index].id;

					matches.push({ id: match_id, a, b, tournament_id: tournament.id, round: newRound });
					results.push(
						{
							player: a,
							final: 'DRAW',
							match: match_id,
							score: 0,
							id: nanoid()
						},
						{ player: b, final: 'DRAW', match: match_id, score: 0, id: nanoid() }
					);
				}
			}
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
