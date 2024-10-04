ALTER TABLE game_sessions.data
    DROP CONSTRAINT data_game_session_id_fkey;

ALTER TABLE assignments.students
    DROP CONSTRAINT students_game_session_id_fkey;

ALTER TABLE assignments.students
    ADD CONSTRAINT students_game_session_id_fkey
        FOREIGN KEY (game_session_id) REFERENCES game_sessions.data (game_session_id) ON DELETE CASCADE;

DROP TABLE game_sessions.ids;