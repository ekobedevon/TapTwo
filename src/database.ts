import pg from 'pg';
import type { DB } from '$lib/db';
import { PostgresDialect, Kysely } from 'kysely';
import { AUTH_PG_USER, AUTH_PG_PASSWORD, PG_URL, DB_NAME } from '$env/static/private';

const dialect = new PostgresDialect({
	pool: new pg.Pool({
		database: DB_NAME,
		host: PG_URL,
		user: AUTH_PG_USER,
		password: AUTH_PG_PASSWORD,
		port: 5432,
		max: 10
	})
});

export const db = new Kysely<DB>({
	dialect
});
