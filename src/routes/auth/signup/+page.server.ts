// routes/signup/+page.server.ts
import { generate } from 'random-words';
import { fail, redirect } from '@sveltejs/kit';
//import { generateId } from 'lucia';
import * as argon2 from 'argon2';
//import { authDB, avonDB } from '$lib/db/db.server';
import { nanoid } from 'nanoid';

import type { PageServerLoad, Actions } from './$types';
import { createUser } from '$lib/utils/AuthDB';
import { generateSessionToken, newSession, setSessionTokenCookie } from '$lib/server/auth';

const usernameGen = () => {
	return generate({ exactly: 3, join: '', maxLength: 5 }) + nanoid(3);
};

// const addToUserTable = async (id: string) => {
// 	const authResponse = await avonDB
// 		.insert(user_details)
// 		.values({ userId: id, display: `USER#${nanoid()}` });
// };

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) redirect(302, '/');
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');
		console.log('USER ATTEMPTING TO SIGNUP');
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
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const userId = nanoid(15);
		const hashed_password = await argon2.hash(password);
		const token = generateSessionToken();
		try {
			await createUser({
				id: userId,
				username: usernameGen(),
				email,
				hashed_password
			});
		} catch (error) {
			return fail(400, {
				message: 'Email is already being used.'
			});
		}

		const session = await newSession(token, userId); //
		setSessionTokenCookie(event, token, session.expires_at);
		redirect(302, '/auth/post_signup');
	}
};
