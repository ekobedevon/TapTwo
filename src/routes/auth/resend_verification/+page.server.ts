import type { Actions } from '@sveltejs/kit';
import { fail, redirect } from '@sveltejs/kit';

import { emailCheck } from '$lib/utils/AuthDB';
import { sendVerifyEmail } from '$lib/server/email';
import type { PageServerLoad } from './$types';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');

		// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (
			typeof email !== 'string' ||
			email.length < 3 ||
			email.length > 60 ||
			!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.toLowerCase())
		) {
			return fail(400, {
				message: 'Invalid username'
			});
		}

		const existingUser = await emailCheck(email);

		if (existingUser) {
			const user = existingUser;
			if (user.email_verified === false) {
				sendVerifyEmail(user.email, user.username, user.id);
			}
		}

		redirect(302, '/auth/post_resend');
	}
};
