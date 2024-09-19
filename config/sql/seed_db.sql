INSERT INTO users.ids
DEFAULT VALUES;
INSERT INTO game_sessions.ids(game_session_id)
VALUES ('9ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, game_session_id, role)
VALUES (1, 'poemmys', 'pass', 'test_salt', 'Jackson', 'Furr', '9ff6b354-1063-40f6-b196-fa422723b978', 'S');

INSERT INTO game_sessions.data(game_session_id, user_id)
VALUES ('9ff6b354-1063-40f6-b196-fa422723b978', 1);
