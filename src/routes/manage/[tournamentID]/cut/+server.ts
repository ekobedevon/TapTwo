import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';

export const POST = async (event: RequestEvent): Promise<Response> => {
	if (!event.locals.user || !event.params.tournamentID) redirect(302, '/');

	const body: any = await event.request.json();
	const cut: number = body.cut;
	const tournamentID: string = event.params.tournamentID;

	console.log(body);

	const tournament = await db
		.selectFrom('tournament')
		.selectAll()
		.where('id', '=', tournamentID)
		.where('organizer_id', '=', event.locals.user.id)
		.executeTakeFirst();

	if (tournament) {
		let players = await db
			.selectFrom('entry')
			.innerJoin('auth_user', 'auth_user.id', 'entry.player')
			.select(['auth_user.id', 'entry.points'])
			.where('entry.status', '=', 'ACTIVE')
			.where('entry.tournament', '=', tournament.id)
			.orderBy('points', 'desc')
			.execute();

		if (players.length <= cut) {
			return Promise.resolve(
				new Response(
					JSON.stringify({ message: 'Player count already at or below cut threshold' }),
					{
						status: 500 //TODO, UPDATE WITH MORE ACCURATE CODE
					}
				)
			);
		}
		//mark all below cut line as cut
		for (let index = players.length - cut ; index > 0; index--) {
			await db
				.updateTable('entry')
				.set({ status: 'CUT' })
				.where('tournament', '=', tournament.id)
				.where('entry.player', '=', players[index].id)
				.execute();
		}
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
