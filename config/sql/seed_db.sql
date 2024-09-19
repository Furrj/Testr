INSERT INTO users.ids
DEFAULT VALUES;
INSERT INTO users.ids
DEFAULT VALUES;

INSERT INTO game_sessions.ids(game_session_id)
VALUES ('9ff6b354-1063-40f6-b196-fa422723b978');


INSERT INTO game_sessions.ids(game_session_id)
VALUES ('8ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (1, 'mfurr', 'pass', 'test_salt', 'Michele', 'Furr', 'T');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (2, 'poemmys', 'pass', 'test_salt', 'Jackson', 'Furr', 'S');

INSERT INTO game_sessions.data(game_session_id, user_id)
VALUES ('9ff6b354-1063-40f6-b196-fa422723b978', 1);

INSERT INTO game_sessions.data(game_session_id, user_id)
VALUES ('8ff6b354-1063-40f6-b196-fa422723b978', 2);

INSERT INTO users.game_session(user_id, game_session_id)
VALUES (1, '9ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO users.game_session(user_id, game_session_id)
VALUES (2, '8ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO teachers.data(user_id, periods)
VALUES (1, 5);

INSERT INTO students.data(user_id, teacher_id, period)
VALUES (2, 1, 1);
