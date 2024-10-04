ALTER TABLE assignments.students
    DROP COLUMN user_id;

SET search_path TO assignments;

ALTER TABLE students
    RENAME TO sessions;