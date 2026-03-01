import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding';
import { sha256 } from '@oslojs/crypto/sha2';
import { createSession, deleteSession, getSession, getUser, updateSession } from '../utils/AuthDB';
import type { RequestEvent } from '@sveltejs/kit';
import type { AuthUser, UserSession } from '$lib/db';
import type { Session, SessionValidationResult } from '$lib/types/auth_types';

export function setSessionTokenCookie(event: RequestEvent, token: string, expires_at: Date): void {
	event.cookies.set('session', token, {
		httpOnly: true,
		sameSite: 'lax',
		expires: expires_at,
		path: '/'
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set('session', '', {
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 0,
		path: '/'
	});
}

export function generateSessionToken(): string {
	const bytes = new Uint8Array(20);
	crypto.getRandomValues(bytes);
	const token = encodeBase32LowerCaseNoPadding(bytes);
	return token;
}

export async function newSession(token: string, user_id: string) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		user_id,
		expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	};
	await createSession(session.id, session.user_id, session.expires_at);

	return session;
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const row = await getSession(sessionId);
	if (row === undefined) {
		return { session: null, user: null };
	}
	const session: Session = {
		id: row.id,
		user_id: row.user_id,
		expires_at: row.expires_at
	};
	const user = await getUser(row.user_id);
	if (Date.now() >= session.expires_at.getTime()) {
		await deleteSession(session.id);
		return { session: null, user: null };
	}
	if (Date.now() >= session.expires_at.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expires_at = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
		await updateSession(session.id);
	}
	if (user === undefined) {
		return { session: null, user: null };
	}
	return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
	await deleteSession(sessionId);
}
