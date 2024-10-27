BEGIN;

CREATE TABLE users.validation_codes
(
    user_id   INTEGER REFERENCES users.ids (user_id) ON DELETE CASCADE,
    code      UUID,
    issued_at BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

CREATE TABLE users.account_status
(
    user_id         INTEGER REFERENCES users.ids (user_id) ON DELETE CASCADE,
    is_active       BOOLEAN  NOT NULL DEFAULT false,
    membership_type SMALLINT NOT NULL DEFAULT -1
);

CREATE TABLE users.contact_info
(
    user_id INTEGER REFERENCES users.ids (user_id) ON DELETE CASCADE,
    email   TEXT NOT NULL,
    phone   TEXT NOT NULL DEFAULT ''
);
CREATE UNIQUE INDEX unique_email_case_insensitive ON users.contact_info (LOWER(email));

INSERT INTO users.contact_info (user_id, email)
SELECT user_id, email
FROM teachers.data;

ALTER TABLE teachers.data
    DROP COLUMN email;

ALTER TYPE users.role ADD VALUE 'N';

INSERT INTO users.account_status (user_id, membership_type, is_active)
VALUES (1, 3, true);

ALTER TABLE teachers.data
    RENAME COLUMN user_id to teacher_id;

COMMIT;