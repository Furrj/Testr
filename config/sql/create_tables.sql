CREATE SCHEMA users;
CREATE SCHEMA game_sessions;

CREATE TYPE users.role AS ENUM ('S', 'T', 'A');

CREATE TABLE users.ids
(
    user_id SERIAL PRIMARY KEY
);

CREATE TABLE game_sessions.ids
(
  game_session_id UUID PRIMARY KEY
);

CREATE TABLE game_sessions.data
(
  game_session_id UUID PRIMARY KEY REFERENCES game_sessions.ids(game_session_id),
  user_id INTEGER REFERENCES users.ids(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE users.data
(
    user_id    INTEGER PRIMARY KEY UNIQUE REFERENCES users.ids(user_id),
    username   VARCHAR(32) UNIQUE,
    password   TEXT,
    salt       TEXT,
    first_name VARCHAR(32),
    last_name  VARCHAR(32),
    game_session_id UUID REFERENCES game_sessions.ids(game_session_id),
    role users.role DEFAULT 'S'
);
