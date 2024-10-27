BEGIN;

ALTER TABLE teachers.data
ADD column stripe_id text;

COMMIT;
