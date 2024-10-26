BEGIN;

ALTER TABLE teachers.data
    ADD column is_active boolean;

CREATE TABLE teachers.registration
(
    email        TEXT PRIMARY KEY,
    is_validated boolean,
    code         UUID,
    issued_at    BIGINT DEFAULT EXTRACT(EPOCH FROM NOW())
);

COMMIT;