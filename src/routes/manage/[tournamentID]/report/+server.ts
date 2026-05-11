import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';

export const POST = async (event: RequestEvent): Promise<Response> => {
	if (
		!event.locals.user ||
		!event.params.tournamentID ||
		!event.url.searchParams.get('match') 
	)
		redirect(302, '/');

	const body: any = await event.request.json();
	const userID: string = event.locals.user.id;
	const tournamentID: string = event.params.tournamentID;
	const matchID: string = event.url.searchParams.get('match') as string;

	console.log(body);

	const match = await db
		.selectFrom('matches')
		.selectAll()
		.where('matches.id', '=', matchID)
		.where((eb) => eb.or([eb('matches.a', '=', userID), eb('matches.b', '=', userID)]))
		.where('tournament_id', '=', tournamentID);

	// const tournament = await db
	// 	.selectFrom('tournament')
	// 	.selectAll()
	// 	.where('id', '=', tournamentID)
	// 	.where('organizer_id', '=', event.locals.user.id)
	// 	.executeTakeFirst();

	// if (tournament) {
	// 	const response = await db
	// 		.insertInto('entry')
	// 		.values({ tournament: tournamentID, player: userID })
	// 		.returningAll()
	// 		.executeTakeFirst();

	// 	console.log(response);
	// }

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
