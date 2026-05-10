import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';

export const GET = async (event: RequestEvent): Promise<Response> => {
	const entries = await db
		.selectFrom('entry')
		.innerJoin('auth_user', 'auth_user.id', 'entry.player')
		.select(['auth_user.id', 'auth_user.username', 'wins', 'loses', 'ties'])
		.orderBy('entry.wins', 'asc')
		.execute();

	if (!entries.length) {
		return Promise.resolve(
			new Response(JSON.stringify({ message: 'Failed to retrieve list' }), {
				status: 500
			})
		);
	}

	console.log(entries);
	return Promise.resolve(
		new Response(JSON.stringify({ entries }), {
			status: 200
		})
	);
};
