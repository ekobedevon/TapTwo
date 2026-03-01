// routes/login/+page.server.ts

import { db } from 'db';
import { fail, redirect } from '@sveltejs/kit';

import * as argon2 from 'argon2';

import type { Actions, PageServerLoad } from './$types';

import { emailCheck } from '$lib/utils/AuthDB';
import { generateSessionToken, newSession } from '$lib/server/auth';
import { setSessionTokenCookie } from '$lib/server/auth';

const validateEmail = (email: string) => {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailPattern.test(email);
};

export const load: PageServerLoad = async (event: any) => {
	if (event.locals.user) redirect(302, '/');
};

export const actions: Actions = {
	default: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');
		const password = formData.get('password');

		if (
			typeof email !== 'string' ||
			email.length < 3 ||
			email.length > 60 ||
			!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.toLowerCase())
		) {
			return fail(400, {
				message: 'Invalid email'
			});
		}
		if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
			return fail(400, {
				message: 'Invalid password'
			});
		}

		const existingUser = await emailCheck(email);

		if (!existingUser) {
			// NOTE:
			// Returning immediately allows malicious actors to figure out valid emails from response times,
			// allowing them to only focus on guessing passwords in brute-force attacks.
			// As a preventive measure, you may want to hash passwords even for invalid emails.
			// However, valid emails can be already be revealed with the signup page among other methods.
			// It will also be much more resource intensive.
			// Since protecting against this is non-trivial,
			// it is crucial your implementation is protected against brute-force attacks with login throttling etc.
			// If emails are public, you may outright tell the user that the email is invalid.
			return fail(400, {
				message: 'Incorrect email or password'
			});
		}

		if (existingUser.email_verified === false) {
			// No need to alter for dev, auto verification happens in dev enviroment
			return fail(400, {
				message: 'Please verify email before login.'
			});
		}

		//Added non null assertion (!) to hashed password as if no user exists then this function will not be called
		const validPassword = await argon2.verify(existingUser.hashed_password!, password);

		if (!validPassword) {
			return fail(400, {
				message: 'Incorrect email or password'
			});
		}
		const token = generateSessionToken();
		const session = await newSession(token, existingUser.id);
		setSessionTokenCookie(event, token, session.expires_at);
		redirect(302, '/');
	}
};
