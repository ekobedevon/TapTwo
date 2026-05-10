#!/bin/bash

if [ -z "$POSTGRES_USER" ] || [ -z "$POSTGRES_DB" ] || [ -z "$DB_NAME" ]; then
    echo "One or more required environment variables are missing: POSTGRES_USER, POSTGRES_DB, DB_NAME"
    exit 1
fi

echo "Creating the $DB_NAME database with $POSTGRES_USER..."

psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE \"$DB_NAME\";"

if [ $? -ne 0 ]; then
    echo "Failed to create $DB_NAME database."
    exit 1
fi

echo "Connect and setup $DB_NAME auth tables..."

psql -U "$POSTGRES_USER" -d "$DB_NAME" <<EOSQL

CREATE TYPE roles AS ENUM ('Admin','Moderator','Creator','User');
CREATE TYPE match_status AS ENUM ('WIN','LOSE','TIE');
CREATE TYPE tournament_status AS ENUM ('TBD','Set','Running','Complete');

CREATE TABLE auth_user (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    hashed_password TEXT NOT NULL,
    join_date TIMESTAMP NOT NULL DEFAULT now(),
    email_verified BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE user_session (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE email_verification_request (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE tournament (
    id TEXT PRIMARY KEY,
    organizer_id TEXT NOT NULL REFERENCES auth_user(id),
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    title TEXT NOT NULL,
    game TEXT NOT NULL,
    format TEXT NOT NULL,
    date TIMESTAMP NOT NULL,
    rounds INTEGER NOT NULL DEFAULT 1,
    status tournament_status NOT NULL DEFAULT 'TBD'
);

CREATE TABLE matches (
    id TEXT PRIMARY KEY,
    tournament_id TEXT NOT NULL REFERENCES tournament(id),
    a TEXT NOT NULL REFERENCES auth_user(id),
    b TEXT NOT NULL REFERENCES auth_user(id),
    date TIMESTAMP NOT NULL
);

CREATE TABLE results (
    id TEXT PRIMARY KEY,
    match TEXT NOT NULL REFERENCES matches(id),
    player TEXT NOT NULL REFERENCES auth_user(id),
    score INTEGER NOT NULL DEFAULT 0,
    final match_status NOT NULL DEFAULT 'TIE'
);

CREATE TABLE entry (
    tournament TEXT NOT NULL REFERENCES tournament(id),
    player TEXT NOT NULL REFERENCES auth_user(id),
    wins INTEGER NOT NULL DEFAULT 0,
    loses INTEGER NOT NULL DEFAULT 0,
    ties INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (tournament,player)
);

EOSQL

if [ $? -eq 0 ]; then
    echo "$DB_NAME database setup complete."
else
    echo "Failed to setup $DB_NAME database."
    exit 1
fi

psql -U "$POSTGRES_USER" -c "ALTER USER \"$POSTGRES_USER\" WITH PASSWORD '$POSTGRES_PASSWORD';"

if [ $? -eq 0 ]; then
    echo "Password for $POSTGRES_USER changed successfully."
else
    echo "Failed to change password for $POSTGRES_USER."
    exit 1
fi