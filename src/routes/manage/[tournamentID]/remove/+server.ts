import type { RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from 'db';
import type { Updateable } from 'kysely';
import type { Results } from 'lib/db';

export const DELETE = async (event: RequestEvent): Promise<Response> => {
	if (!event.locals.user || !event.params.tournamentID) {
		return Promise.resolve(
			new Response(JSON.stringify({ message: 'You must be logged in!' }), {
				status: 401
			})
		);
	}
	const body: any = await event.request.json();
	console.log('---------BODY---------');
	const userID: string = event.url.searchParams.get('userID') as string;
	// const { userID }: { userID: string } = body.userID;

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
	//if tournament hasn't started, player can be removed, otherwise they are dropped
	if (tournament.rounds === 0) {
		const entry = await db
			.deleteFrom('entry')
			.where('entry.tournament', '=', tournament.id)
			.where('entry.player', '=', userID)
			.executeTakeFirst();
	} else {
		const entries = await db.selectFrom("entry").selectAll().where('entry.player','=',userID).execute()
		console.log(entries)


		const entry = await db
			.updateTable('entry')
			.set({ status: 'DROP' })
			.where('entry.tournament', '=', tournament.id)
			.where('entry.player', '=', userID)
			.returningAll()
			.executeTakeFirst();
		console.log("------UPDATE ENTRY-----")
		console.log(entry)
		const match = await db
			.selectFrom('matches')
			.where((eb) => eb.or([eb('matches.a', '=', userID), eb('matches.b', '=', userID)]))
			.where('round', '=', tournament.rounds)
			.where('tournament_id', '=', tournamentID)
			.where('finished', '=', false)
			.selectAll()
			.executeTakeFirst();

		//if the player is in an active match while being removed
		if (match) {
			console.log('ACTIVE');
			const lose: Updateable<Results> = {
				final: 'LOSE'
			};
			const win: Updateable<Results> = {
				final: 'WIN',
				score: 1
			};
			await db
				.updateTable('results')
				.set(lose)
				.where('player', '=', userID)
				.where('match', '=', match.id)
				.execute();

			const opponentID = userID == match.a ? match.b : match.a;

			await db
				.updateTable('results')
				.set(win)
				.where('player', '=', opponentID)
				.where('match', '=', match.id)
				.execute();
		}
	}

	return Promise.resolve(
		new Response(JSON.stringify({ message: 'Player removed from tournament' }), {
			status: 200
		})
	);
};
