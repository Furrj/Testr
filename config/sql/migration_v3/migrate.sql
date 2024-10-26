BEGIN;

CREATE TABLE teachers.registration
(
    teacher_id   INTEGER REFERENCES teachers.data (user_id) ON DELETE CASCADE,
    is_validated boolean,
    code         UUID,
    issued_at    BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

ALTER TABLE teachers.data
    ADD column is_active boolean NOT NULL DEFAULT false;

COMMIT;