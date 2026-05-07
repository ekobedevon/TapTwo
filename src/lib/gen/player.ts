import * as argon2 from 'argon2';
import type { Insertable } from "kysely";
import type { AuthUser } from "lib/db";
import { nanoid } from "nanoid";
import { db } from 'db';



const hashed_password = await argon2.hash("password")
let newUsers: Insertable<AuthUser>[] = []

for (let index = 0; index < 10; index++) {
    const id = nanoid(10)
    const newUser:Insertable<AuthUser> = {
        email: `${id}@taptwo.com`,
        email_verified: true,
        hashed_password,
        id,
        username:`user_${id}`
    }
    newUsers.push(newUser)
    
}

const user_ids = await db.insertInto("auth_user").values(newUsers).returning("id").execute()