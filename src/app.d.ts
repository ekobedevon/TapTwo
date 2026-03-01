// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { User, Session } from '$lib/types/auth_types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User | null;
			session: Session | null;
		}
		// interface PageData {
		// 	flash?: { type: 'success' | 'error'; message: string };
		// }
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
