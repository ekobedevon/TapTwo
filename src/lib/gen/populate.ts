import * as argon2 from 'argon2';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { PostgresDialect, Kysely, type SelectType, type Insertable } from 'kysely';
import pg from 'pg';
import type { AuthUser, DB, Entry, Tournament } from 'lib/db';
import { customAlphabet } from 'nanoid';

// Load env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

const amount = Number(args[0]);

if (!amount) {
	console.log('Invalid Arguments, missing an amount');
}

const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath, override: true });

// Create DB Connection
const dialect = new PostgresDialect({
	pool: new pg.Pool({
		database: process.env.DB_NAME,
		host: process.env.PG_URL,
		user: process.env.AUTH_PG_USER,
		password: process.env.AUTH_PG_PASSWORD,
		port: 5432,
		max: 10
	})
});

export const gen_db = new Kysely<DB>({
	dialect
});

const alphabet = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 10);

for (let index = 0; index < amount; index++) {
	const userId = nanoid();
	const hashed_password = await argon2.hash('password');
	const organizer_info: Insertable<AuthUser> = {
		email: `${userId}@taptwo.com`,
		email_verified: true,
		hashed_password,
		id: userId,
		username: `user_${userId}`
	};
	const organizer = await gen_db
		.insertInto('auth_user')
		.values(organizer_info)
		.returning('id')
		.executeTakeFirstOrThrow();
	const tourney_id = 'test_' + nanoid(10);
	const newTourney: Insertable<Tournament> = {
		description: 'TEST TOURNAMENT',
		format: 'Pauper',
		game: 'Magic',
		title: 'Test_Tournament_' + nanoid(10),
		rounds: 0,
		location: '',
		organizer_id: organizer.id,
		id: tourney_id,
		date: new Date()
	};
	const tourney = await gen_db
		.insertInto('tournament')
		.values(newTourney)
		.returning('tournament.id')
		.executeTakeFirstOrThrow();

	let newUsers: Insertable<AuthUser>[] = [];
	for (let x = 0; x < 16; x++) {
		const hashed_password = await argon2.hash('password');

		const id = nanoid();
		const newUser: Insertable<AuthUser> = {
			email: `${id}@taptwo.com`,
			email_verified: true,
			hashed_password,
			id,
			username: `user_${id}`
		};
		newUsers.push(newUser);
	}
	const user_ids = await gen_db.insertInto('auth_user').values(newUsers).returning('id').execute();
	let entries: Insertable<Entry>[] = [];
	for (let index = 0; index < user_ids.length; index++) {
		entries.push({ tournament: tourney.id, player: user_ids[index].id });
	}
	await gen_db.insertInto('entry').values(entries).execute();
}

await gen_db.destroy();
process.exit(0);
