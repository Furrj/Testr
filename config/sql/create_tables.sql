CREATE SCHEMA users;
CREATE SCHEMA teachers;
CREATE SCHEMA students;
CREATE SCHEMA game_sessions;
CREATE SCHEMA assignments;

CREATE TYPE users.role AS ENUM ('S', 'T', 'A');

CREATE TABLE users.ids
(
    user_id SERIAL PRIMARY KEY
);

CREATE TABLE teachers.data
(
    user_id      INTEGER PRIMARY KEY references users.ids (user_id) ON DELETE CASCADE,
    email        TEXT UNIQUE NOT NULL,
    school       TEXT        NOT NULL DEFAULT '',
    is_active    BOOLEAN     NOT NULL DEFAULT false,
    is_validated boolean     NOT NULL DEFAULT false
);

CREATE TABLE teachers.validation_codes
(
    teacher_id INTEGER REFERENCES teachers.data (user_id) ON DELETE CASCADE,
    code       UUID,
    issued_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

CREATE TABLE teachers.classes
(
    class_id   SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES teachers.data (user_id) ON DELETE CASCADE,
    name       TEXT
);

CREATE TABLE students.data
(
    user_id    INTEGER PRIMARY KEY REFERENCES users.ids (user_id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers.data (user_id) ON DELETE CASCADE,
    class_id   INTEGER REFERENCES teachers.classes (class_id) ON DELETE CASCADE
);

CREATE TABLE users.data
(
    user_id    INTEGER PRIMARY KEY REFERENCES users.ids (user_id) ON DELETE CASCADE,
    username   VARCHAR(32) UNIQUE,
    password   TEXT,
    salt       TEXT,
    first_name VARCHAR(32),
    last_name  VARCHAR(32),
    role       users.role DEFAULT 'S',
    vertical   BOOLEAN,
    created_at BIGINT     DEFAULT EXTRACT(EPOCH FROM NOW())::bigint,
    updated_at BIGINT
);

CREATE TABLE game_sessions.settings
(
    settings_id  UUID PRIMARY KEY,
    limit_type   SMALLINT,
    limit_amount SMALLINT,
    min          INTEGER,
    max          INTEGER,
    add          BOOLEAN,
    sub          BOOLEAN,
    mult         BOOLEAN,
    div          BOOLEAN
);

CREATE UNIQUE INDEX idx_unique_settings
    ON game_sessions.settings (limit_type, limit_amount, min, max, add, sub,
                               mult, div);

CREATE TABLE game_sessions.data
(
    game_session_id UUID PRIMARY KEY,
    user_id         INTEGER REFERENCES users.ids (user_id) ON DELETE CASCADE,
    settings_id     UUID REFERENCES game_sessions.settings (settings_id) ON DELETE CASCADE,
    timestamp       BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::bigint,
    questions_count INTEGER,
    correct_count   INTEGER,
    score           SMALLINT,
    time            SMALLINT
);

CREATE TABLE assignments.data
(
    assignment_id UUID PRIMARY KEY,
    teacher_id    INTEGER REFERENCES teachers.data (user_id) ON DELETE CASCADE,
    settings_id   UUID REFERENCES game_sessions.settings (settings_id) ON DELETE CASCADE,
    name          TEXT,
    due           BIGINT,
    is_active     BOOLEAN
);

CREATE TABLE assignments.classes
(
    assignment_id UUID REFERENCES assignments.data (assignment_id) ON DELETE CASCADE,
    class_id      INTEGER REFERENCES teachers.classes (class_id) ON DELETE CASCADE,
    PRIMARY KEY (assignment_id, class_id)
);

CREATE TABLE assignments.game_sessions
(
    assignment_id   UUID REFERENCES assignments.data (assignment_id) ON DELETE CASCADE,
    game_session_id UUID REFERENCES game_sessions.data (game_session_id) ON DELETE CASCADE,
    PRIMARY KEY (assignment_id, game_session_id)
);

CREATE TABLE users.password_reset_codes
(
    user_id    INTEGER PRIMARY KEY REFERENCES users.ids (user_id) ON DELETE CASCADE,
    code       VARCHAR(4) UNIQUE,
    created_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())::bigint
);
