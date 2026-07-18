import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Insertable } from 'kysely';
import type { Tournament } from 'lib/db';
import { nanoid } from 'nanoid';
import { db } from 'db';

export const load: PageServerLoad = async (event) => {
	//if (!event.locals.user) redirect(302, '/');
	const tournamentID = event.params.id;

	const tournament = await db
		.selectFrom('tournament')
		.selectAll()
		.where('id', '=', tournamentID)
		.executeTakeFirstOrThrow();
	
	const organizer = await db
		.selectFrom('auth_user')
		.select('auth_user.username')
		.where('id', '=', tournament.organizer_id)
		.executeTakeFirstOrThrow();

	const players = await db
		.selectFrom('entry')
		.innerJoin('auth_user', 'auth_user.id', 'entry.player')
		.where('entry.tournament', '=', tournament.id)
		.select(['auth_user.id', 'auth_user.username', 'wins', 'loses', 'ties', 'points','entry.status'])
		.orderBy('entry.points', 'desc')
		.execute();

	const matches = await db
		.selectFrom('matches')
		.innerJoin('auth_user as user', 'user.id', 'matches.a')
		.innerJoin('auth_user as opponent', 'opponent.id', 'matches.b')

		// player A result
		.innerJoin('results', (join) =>
			join.onRef('results.match', '=', 'matches.id').onRef('results.player', '=', 'matches.a')
		)

		// player B result
		.innerJoin('results as b_results', (join) =>
			join.onRef('b_results.match', '=', 'matches.id').onRef('b_results.player', '=', 'matches.b')
		)

		.select([
			'matches.id',
			'matches.finished',

			'matches.a',
			'matches.b',

			'user.username as player_a',
			'opponent.username as player_b',

			'results.score as player_a_score',
			'b_results.score as player_b_score',
			'matches.round'
		])

		.where('matches.tournament_id', '=', tournamentID)
		.where('matches.round', '=', tournament.rounds)
		.execute();

		

	const activeMatches = await db
		.selectFrom('matches')
		.where('matches.tournament_id', '=', tournamentID)
		.where('matches.round', '=', tournament.rounds)
		.where('matches.finished', '=', false)
		.execute();

	return {
		tournament,
		organizer: organizer.username,
		matches,
		players,
		active: activeMatches.length !== 0
	};
};
// export const actions: Actions = {
// 	default: async (event) => {
// 		const formData = await event.request.formData();
// 		const description = formData.get('description') as string;
// 		const format = formData.get('format') as string;
// 		const game = formData.get('game') as string;
// 		const title = formData.get('title') as string;
// 		const userId = event.locals.user!.id;
// 		const newTourney: Insertable<Tournament> = {
// 			description,
// 			format,
// 			game,
// 			title,
// 			location: '',
// 			organizer_id: userId,
// 			id: nanoid(),
// 			date: new Date()
// 		};

// 		const response = await db
// 			.insertInto('tournament')
// 			.values(newTourney)
// 			.returning('id')
// 			.executeTakeFirst();
// 		console.log('RESPONSE');
// 		console.log(response);
// 		// setSessionTokenCookie(event, token, session.expires_at);
// 		if (response?.id) {
// 			return redirect(302, `/tournament/manage/${response?.id}`);
// 		}
// 		return Promise.reject(new Error('Failed to create tournament'));
// 	}
// };
