BEGIN;

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

WITH distinct_settings AS (SELECT DISTINCT limit_type,
                                           CASE
                                               WHEN limit_type = 0 THEN time
                                               ELSE questions_count
                                               END AS limit_amount,
                                           min,
                                           max,
                                           add,
                                           sub,
                                           mult,
                                           div
                           FROM game_sessions.data)
INSERT
INTO game_sessions.settings (settings_id, limit_type, limit_amount, min, max,
                             add, sub, mult, div)
SELECT gen_random_uuid(),
       limit_type,
       limit_amount,
       min,
       max,
       add,
       sub,
       mult,
       div
FROM distinct_settings;

ALTER TABLE game_sessions.data
    ADD COLUMN settings_id UUID REFERENCES game_sessions.settings (settings_id) ON DELETE CASCADE;

UPDATE game_sessions.data gd
SET settings_id = gs.settings_id
FROM game_sessions.settings gs
WHERE gd.limit_type = gs.limit_type
  AND gd.min = gs.min
  AND gd.max = gs.max
  AND gd.add = gs.add
  AND gd.sub = gs.sub
  AND gd.mult = gs.mult
  AND gd.div = gs.div;

ALTER TABLE game_sessions.data
    DROP COLUMN limit_type,
    DROP COLUMN min,
    DROP COLUMN max,
    DROP COLUMN add,
    DROP COLUMN sub,
    DROP COLUMN mult,
    DROP COLUMN div;

ALTER TABLE assignments.data
    ADD COLUMN settings_id UUID REFERENCES game_sessions.settings (settings_id) ON DELETE CASCADE,
    DROP COLUMN limit_type,
    DROP COLUMN limit_amount,
    DROP COLUMN min,
    DROP COLUMN max,
    DROP COLUMN add,
    DROP COLUMN sub,
    DROP COLUMN mult,
    DROP COLUMN div;

ALTER TABLE assignments.data
    RENAME COLUMN user_id TO teacher_id;

ALTER TABLE teachers.classes
    RENAME COLUMN user_id TO teacher_id;

ALTER TABLE assignments.sessions
    RENAME TO game_sessions;

COMMIT;