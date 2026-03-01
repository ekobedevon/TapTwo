import { fail, redirect } from '@sveltejs/kit';
import { db } from 'db';
import type { PageServerLoad } from './$types';

// import { redirect } from 'sveltekit-flash-message/server';

export const load: PageServerLoad = async (event: any) => {
	//if (event.locals.user) redirect(302, '/');
	//const userID = event.locals.user!.id;
	const id = event.params.id;
	const codeValidation = await db
		.selectFrom('email_verification_request')
		.selectAll()
		.where('email_verification_request.code', '=', id)
		.executeTakeFirst();

	if (!codeValidation) {
		return fail(400, {
			message: 'Invalid Code'
		});
		//redirect('/', { type: 'error', message: 'Invalid Code' }, event.cookies);
	}
	await db
		.updateTable('auth_user')
		.set({ email_verified: true })
		.where('auth_user.id', '=', codeValidation.user_id)
		.where('auth_user.email', '=', codeValidation.email)
		.execute();

	redirect(302, '/auth/login');
};
