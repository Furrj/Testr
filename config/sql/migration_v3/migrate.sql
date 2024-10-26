BEGIN;

CREATE TABLE teachers.validation_codes
(
    teacher_id INTEGER REFERENCES teachers.data (user_id) ON DELETE CASCADE,
    code       UUID,
    issued_at  BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

ALTER TABLE teachers.data
    ADD COLUMN is_active    boolean NOT NULL DEFAULT false,
    ADD COLUMN is_validated boolean NOT NULL DEFAULT false;

COMMIT;