import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';

export const GET = async (event: RequestEvent): Promise<Response> => {
	const tournamentID: string = event.params.tournamentID || '';
	const entries = await db
		.selectFrom('entry')
		.innerJoin('auth_user', 'auth_user.id', 'entry.player')
		.where('entry.tournament', '=', tournamentID)
		.select(['auth_user.id', 'auth_user.username', 'wins', 'loses', 'ties', 'points'])
		.orderBy('entry.points', 'desc')
		.execute();

	console.log(entries)

	if (!entries) {
		return Promise.resolve(
			new Response(JSON.stringify({ message: 'Failed to retrieve list' }), {
				status: 500
			})
		);
	}

	return Promise.resolve(
		new Response(JSON.stringify({ entries }), {
			status: 200
		})
	);
};
