import { db } from 'db';
import { nanoid } from 'nanoid';
import { sendVerifyEmail } from '$lib/server/email';
import type { Insertable, Selectable, Updateable } from 'kysely';
import type { AuthUser, EmailVerificationRequest } from '$lib/db';
import { error } from '@sveltejs/kit';

export const createUser = async (user: Insertable<AuthUser>): Promise<number> => {
	if (import.meta.env.DEV) {
		//auto verify email if in dev to save api keys
		user.email_verified = true;
	}
	await db
		.insertInto('auth_user')
		.values(user)
		.execute()
		.catch((err: any) => {
			console.log(err);
			return null;
		});
	if (import.meta.env.PROD) {
		//only send email in prod
		await sendVerifyEmail(user.email, user.username, user.id);
	}

	return 1;
};

export const getUser = async (user_id: string) => {
	return await db.selectFrom('auth_user').selectAll().where('id', '=', user_id).executeTakeFirst();
};

export const getUserSetting = async (user_id: string) => {
	const authData = await db
		.selectFrom('auth_user')
		.select(['username', 'email', 'email_verified'])
		.where('id', '=', user_id)
		.executeTakeFirst();

	if (authData === undefined) return null;

	return { authData };
};

export const updateAuthUser = async (user_id: string, authUser: Updateable<AuthUser>) => {
	try {
		await db.updateTable('auth_user').set(authUser).where('id', '=', user_id).executeTakeFirst();
	} catch (error) {
		console.error('Error updating', error);
		return Promise.reject(new Error('User setting update failed'));
	}
	return Promise.resolve('Success');
};

export const updateUser = async (user_id: string, authUser: Updateable<AuthUser>) => {
	try {
		await db.updateTable('auth_user').set(authUser).where('id', '=', user_id).executeTakeFirst();
	} catch (error) {
		console.error('Error updating', error);
		return Promise.reject(new Error('User setting update failed'));
	}
	return Promise.resolve('Success');
};

export const createSession = async (
	id: string,
	user_id: string,
	expires_at: Date
): Promise<number> => {
	await db
		.insertInto('user_session')
		.values({
			id,
			user_id,
			expires_at
		})
		.execute()
		.catch((err: any) => {
			console.log(err);
			return null;
		});
	return 1;
};

export const getSession = async (session_id: string) => {
	return await db
		.selectFrom('user_session')
		.select(['user_session.id', 'user_session.user_id', 'user_session.expires_at'])
		.where('id', '=', session_id)
		.executeTakeFirst();
};

export const updateSession = async (session_id: string) => {
	await db
		.updateTable('user_session')
		.set({ expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) })
		.where('id', '=', session_id)
		.execute();
};

export const deleteSession = async (session_id: string) => {
	return await db.deleteFrom('user_session').where('id', '=', session_id).execute();
};

export const emailCheck = async (email: string) => {
	return await db.selectFrom('auth_user').selectAll().where('email', '=', email).executeTakeFirst();
};

export const createEmailVerfication = async (verify: Insertable<EmailVerificationRequest>) => {
	await db.insertInto('email_verification_request').values(verify).execute();
};
