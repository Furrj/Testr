BEGIN;

ALTER TABLE teachers.data
    ADD column is_active boolean;

CREATE TABLE teachers.registration
(
    user_id INTEGER REFERENCES users.ids (user_id) ON DELETE CASCADE,
    email   TEXT UNIQUE,
    code    UUID,
    expiry  BIGINT DEFAULT EXTRACT(EPOCH FROM (NOW() + INTERVAL '1 hour'))::BIGINT
);

COMMIT;