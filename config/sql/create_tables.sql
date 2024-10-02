CREATE SCHEMA users;
CREATE SCHEMA teachers;
CREATE SCHEMA students;
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

CREATE TABLE teachers.data
(
    user_id INTEGER PRIMARY KEY references users.ids (user_id),
    email   TEXT UNIQUE,
    school  TEXT
);

CREATE TABLE teachers.classes
(
    class_id SERIAL PRIMARY KEY,
    user_id  INTEGER REFERENCES teachers.data (user_id),
    name     TEXT
);

CREATE TABLE teachers.assignments
(
    assignment_id UUID PRIMARY KEY,
    user_id       INTEGER REFERENCES teachers.data (user_id),
    class_id      INTEGER REFERENCES teachers.classes (class_id),
    name          TEXT,
    due           BIGINT,
    limit_type    SMALLINT,
    limit_amount  SMALLINT,
    min           INTEGER,
    max           INTEGER,
    add           BOOLEAN,
    sub           BOOLEAN,
    mult          BOOLEAN,
    div           BOOLEAN,
    is_active     BOOLEAN
);

CREATE TABLE students.data
(
    user_id    INTEGER PRIMARY KEY REFERENCES users.ids (user_id),
    teacher_id INTEGER REFERENCES teachers.data (user_id),
    class_id   INTEGER REFERENCES teachers.classes (class_id)
);

CREATE TABLE students.assignments
(
    assignment_id   UUID PRIMARY KEY,
    game_session_id UUID REFERENCES game_sessions.ids,
    user_id         INTEGER REFERENCES students.data (user_id)
);

CREATE TABLE game_sessions.data
(
    game_session_id UUID PRIMARY KEY REFERENCES game_sessions.ids (game_session_id),
    user_id         INTEGER REFERENCES users.ids (user_id),
    timestamp       BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::bigint,
    limit_type      SMALLINT,
    questions_count INTEGER,
    correct_count   INTEGER,
    score           SMALLINT,
    time            SMALLINT,
    min             INTEGER,
    max             INTEGER,
    add             BOOLEAN,
    sub             BOOLEAN,
    mult            BOOLEAN,
    div             BOOLEAN
);

CREATE TABLE users.data
(
    user_id    INTEGER PRIMARY KEY REFERENCES users.ids (user_id),
    username   VARCHAR(32) UNIQUE,
    password   TEXT,
    salt       TEXT,
    first_name VARCHAR(32),
    last_name  VARCHAR(32),
    role       users.role DEFAULT 'S',
    vertical   BOOLEAN,
    created_at BIGINT     DEFAULT EXTRACT(EPOCH FROM NOW()),
    updated_at BIGINT
);
