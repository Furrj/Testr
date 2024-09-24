INSERT INTO users.ids
DEFAULT VALUES;
INSERT INTO users.ids
DEFAULT VALUES;
INSERT INTO users.ids
DEFAULT VALUES;
INSERT INTO users.ids
DEFAULT VALUES;
INSERT INTO users.ids
DEFAULT VALUES;
INSERT INTO users.ids
DEFAULT VALUES;

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (1, 'mfurr', 'pass', 'test_salt', 'Michele', 'Furr', 'T');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (2, 'poemmys', 'pass', 'test_salt', 'Jackson', 'Furr', 'S');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (3, 'test2', 'pass', 'test_salt', 'test', 'two', 'S');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (4, 'test3', 'pass', 'test_salt', 'test', 'three', 'S');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (5, 'test4', 'pass', 'test_salt', 'test', 'four', 'S');

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name, role)
VALUES (6, 'test5', 'pass', 'test_salt', 'test', 'five', 'S');

INSERT INTO teachers.data(user_id, periods)
VALUES (1, 5);

INSERT INTO students.data(user_id, teacher_id, period)
VALUES (2, 1, 1);

INSERT INTO students.data(user_id, teacher_id, period)
VALUES (3, 1, 2);

INSERT INTO students.data(user_id, teacher_id, period)
VALUES (4, 1, 3);

INSERT INTO students.data(user_id, teacher_id, period)
VALUES (5, 1, 4);

INSERT INTO students.data(user_id, teacher_id, period)
VALUES (6, 1, 5);

INSERT INTO game_sessions.ids(game_session_id)
VALUES ('1ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO game_sessions.ids(game_session_id)
VALUES ('2ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO game_sessions.ids(game_session_id)
VALUES ('3ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO game_sessions.ids(game_session_id)
VALUES ('4ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO game_sessions.ids(game_session_id)
VALUES ('5ff6b354-1063-40f6-b196-fa422723b978');

INSERT INTO game_sessions.data (
  game_session_id, user_id, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div
)
VALUES (
  '1ff6b354-1063-40f6-b196-fa422723b978', 2, 
  2,
  10,
  7,
  70,
  60,
  1,
  20,
  false,
  false,
  true,
  false
);

INSERT INTO game_sessions.data (
  game_session_id, user_id, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div
)
VALUES (
  '2ff6b354-1063-40f6-b196-fa422723b978', 2, 
  3,
  10,
  7,
  70,
  60,
  1,
  20,
  false,
  false,
  true,
  false
);

INSERT INTO game_sessions.data (
  game_session_id, user_id, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div
)
VALUES (
  '3ff6b354-1063-40f6-b196-fa422723b978', 2, 
  4,
  10,
  7,
  70,
  60,
  1,
  20,
  false,
  false,
  true,
  false
);

INSERT INTO game_sessions.data (
  game_session_id, user_id, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div
)
VALUES (
  '4ff6b354-1063-40f6-b196-fa422723b978', 2, 
  5,
  10,
  7,
  70,
  60,
  1,
  20,
  false,
  false,
  true,
  false
);

INSERT INTO game_sessions.data (
  game_session_id, user_id, limit_type, questions_count, correct_count, score, time, min, max, add, sub, mult, div
)
VALUES (
  '5ff6b354-1063-40f6-b196-fa422723b978', 2, 
  6,
  10,
  7,
  70,
  60,
  1,
  20,
  false,
  false,
  true,
  false
);