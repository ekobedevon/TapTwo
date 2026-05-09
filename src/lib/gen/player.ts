import * as argon2 from 'argon2';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { PostgresDialect, Kysely, type SelectType, type Insertable } from 'kysely';
import pg from 'pg';
import type { AuthUser, DB } from 'lib/db';
import { customAlphabet } from 'nanoid';

// Load env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

console.log('making new users');
let newUsers: Insertable<AuthUser>[] = [];

const alphabet = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const nanoid = customAlphabet(alphabet, 10);

for (let index = 0; index < 10; index++) {
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

console.log(user_ids);

await gen_db.destroy();
process.exit(0);
