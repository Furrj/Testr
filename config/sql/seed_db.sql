INSERT INTO users.ids
DEFAULT VALUES;
INSERT INTO users.ids
DEFAULT VALUES;

INSERT INTO game_sessions.ids(game_session_id)
VALUES ('8ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (1, 'mfurr', 'pass', 'test_salt', 'Michele', 'Furr', 'T');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (2, 'poemmys', 'pass', 'test_salt', 'Jackson', 'Furr', 'S');

INSERT INTO game_sessions.data (
  game_session_id, user_id, limit_type, questions_count, correct_count, score, min, max, add, sub, mult, div
)
VALUES (
  '8ff6b354-1063-40f6-b196-fa422723b978', 2, 
  1,
  10,
  7,
  70,
  1,
  20,
  false,
  false,
  true,
  false
);

INSERT INTO teachers.data(user_id, periods)
VALUES (1, 5);

INSERT INTO students.data(user_id, teacher_id, period)
VALUES (2, 1, 1);
