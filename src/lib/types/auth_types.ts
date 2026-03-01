export type SessionValidationResult =
	| { session: Session; user: User }
	| { session: null; user: null };

export interface Session {
	id: string;
	user_id: string;
	expires_at: Date;
}

export interface User {
	id: string;
	username: string;
	email?: string;
	hashed_password?: string;
	email_verified?: boolean;
}

export interface EmailVerificationRequest {
	id: string;
	user_id: number;
	email: string;
	code: string;
	expires_at: Date;
}
