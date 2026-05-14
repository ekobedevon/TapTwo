import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';
import type { Insertable, Updateable } from 'kysely';
import type { Matches, Results } from 'lib/db';

export const POST = async (event: RequestEvent): Promise<Response> => {
	if (!event.locals.user || !event.params.tournamentID || !event.url.searchParams.get('match'))
		redirect(302, '/');

	const body: any = await event.request.json();
	const userID: string = event.locals.user.id;
	const tournamentID: string = event.params.tournamentID;
	const matchID: string = event.url.searchParams.get('match') as string;

	// const match = await db
	// 	.selectFrom('matches')
	// 	.selectAll()
	// 	.where('matches.id', '=', matchID)
	// 	.where((eb) => eb.or([eb('matches.a', '=', userID), eb('matches.b', '=', userID)]))
	// 	.where('tournament_id', '=', tournamentID);

	const tournament = await db
		.selectFrom('tournament')
		.selectAll()
		.where('id', '=', tournamentID)
		.where('organizer_id', '=', userID)
		.executeTakeFirst();

	if (tournament) {
		// const match = await db
		// 	.selectFrom('matches')
		// 	.selectAll()
		// 	.where('matches.id', '=', matchID)
		// 	.where((eb) => eb.or([eb('matches.a', '=', userID), eb('matches.b', '=', userID)]))
		// 	.where('tournament_id', '=', tournament.id);
		console.log('BODY-------------------------------');
		console.log(body);
		let { selected_match } = body;
		selected_match.finished = true;

		await db
			.updateTable('matches')
			.set({ finished: true })
			.where('matches.id', '=', selected_match.id)
			.execute();

		if (selected_match.player_a_score === selected_match.player_b_score) {
			console.log('DRAW');
			const player_a: Updateable<Results> = {
				final: 'DRAW',
				score: selected_match.player_a_score
			};

			const player_b: Updateable<Results> = {
				final: 'DRAW',
				score: selected_match.player_b_score
			};

			await db
				.updateTable('results')
				.set(player_a)
				.where('results.player', '=', selected_match.a)
				.where('match', '=', selected_match.id)
				.execute();
			await db
				.updateTable('results')
				.set(player_b)
				.where('results.player', '=', selected_match.b)
				.where('match', '=', selected_match.id)
				.execute();

			return Promise.resolve(
				new Response(JSON.stringify({ message: 'Score Updated' }), {
					status: 200
				})
			);
		} else {
			console.log('WINNER');
			const winner_id =
				selected_match.player_a_score > selected_match.player_b_score
					? selected_match.a
					: selected_match.b;

			const player_a: Updateable<Results> = {
				final: winner_id === selected_match.a ? 'WIN' : 'LOSE',
				score: selected_match.player_a_score
			};

			const player_b: Updateable<Results> = {
				final: winner_id === selected_match.b ? 'WIN' : 'LOSE',
				score: selected_match.player_b_score
			};

			await db
				.updateTable('results')
				.set(player_a)
				.where('results.player', '=', selected_match.a)
				.where('match', '=', selected_match.id)
				.execute();
			await db
				.updateTable('results')
				.set(player_b)
				.where('results.player', '=', selected_match.b)
				.where('match', '=', selected_match.id)
				.execute();
		}
	}

	return Promise.resolve(
		new Response(JSON.stringify({ message: 'Score Updated' }), {
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
