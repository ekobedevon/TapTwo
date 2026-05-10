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

	const entry = await db
		.deleteFrom('entry')
		.where('entry.tournament', '=', tournament.id)
		.where('entry.player', '=', body.userID)
		.executeTakeFirst();
	// const entries = await db
	// 	.selectFrom('entry')
	// 	.innerJoin('auth_user', 'auth_user.id', 'entry.user_id')
	// 	.select(['auth_user.id', 'auth_user.username'])
	// 	.execute();

	// if (!entries.length) {
	// 	return Promise.resolve(
	// 		new Response(JSON.stringify({ message: 'Failed to retrieve list' }), {
	// 			status: 500
	// 		})
	// 	);
	// }

	// console.log(entries);
	// return Promise.resolve(
	// 	new Response(JSON.stringify({ entries }), {
	// 		status: 200
	// 	})
	// );

	return Promise.resolve(
		new Response(JSON.stringify({ message: 'Player Deleted' }), {
			status: 200
		})
	);
};
