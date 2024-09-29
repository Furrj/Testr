INSERT INTO users.ids
    DEFAULT
VALUES;
INSERT INTO users.ids
    DEFAULT
VALUES;
INSERT INTO users.ids
    DEFAULT
VALUES;
INSERT INTO users.ids
    DEFAULT
VALUES;
INSERT INTO users.ids
    DEFAULT
VALUES;
INSERT INTO users.ids
    DEFAULT
VALUES;

INSERT INTO users.data(user_id, username, password, salt, first_name, last_name,
                       role, vertical)
VALUES (1, 'mfurr', 'pass', 'test_salt', 'Michele', 'Furr', 'T', true);
INSERT INTO users.data(user_id, username, password, salt, first_name, last_name,
                       role, vertical)
VALUES (2, 'poemmys', 'pass', 'test_salt', 'Jackson', 'Furr', 'S', true);
INSERT INTO users.data(user_id, username, password, salt, first_name, last_name,
                       role, vertical)
VALUES (3, 'test2', 'pass', 'test_salt', 'test', 'two', 'S', true);
INSERT INTO users.data(user_id, username, password, salt, first_name, last_name,
                       role, vertical)
VALUES (4, 'test3', 'pass', 'test_salt', 'test', 'three', 'S', true);
INSERT INTO users.data(user_id, username, password, salt, first_name, last_name,
                       role, vertical)
VALUES (5, 'test4', 'pass', 'test_salt', 'test', 'four', 'S', true);
INSERT INTO users.data(user_id, username, password, salt, first_name, last_name,
                       role, vertical)
VALUES (6, 'test5', 'pass', 'test_salt', 'test', 'five', 'S', false);

INSERT INTO teachers.data(user_id, email, school)
VALUES (1, 'mfurr@bca.edu', 'BCA');

INSERT INTO teachers.classes (user_id, name)
VALUES (1, 'class 1');
INSERT INTO teachers.classes (user_id, name)
VALUES (1, 'class 2');
INSERT INTO teachers.classes (user_id, name)
VALUES (1, 'class 3');
INSERT INTO teachers.classes (user_id, name)
VALUES (1, 'class 4');
INSERT INTO teachers.classes (user_id, name)
VALUES (1, 'class 5');

INSERT INTO students.data(user_id, teacher_id, class_id)
VALUES (2, 1, 1);
INSERT INTO students.data(user_id, teacher_id, class_id)
VALUES (3, 1, 2);
INSERT INTO students.data(user_id, teacher_id, class_id)
VALUES (4, 1, 3);
INSERT INTO students.data(user_id, teacher_id, class_id)
VALUES (5, 1, 4);
INSERT INTO students.data(user_id, teacher_id, class_id)
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

INSERT INTO game_sessions.data (game_session_id, user_id, limit_type,
                                questions_count, correct_count, score, time,
                                min,
                                max, add, sub, mult, div)
VALUES ('1ff6b354-1063-40f6-b196-fa422723b978', 2,
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
        false);

INSERT INTO game_sessions.data (game_session_id, user_id, limit_type,
                                questions_count, correct_count, score, time,
                                min,
                                max, add, sub, mult, div)
VALUES ('2ff6b354-1063-40f6-b196-fa422723b978',
        3,
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
        false);

INSERT INTO game_sessions.data (game_session_id, user_id, limit_type,
                                questions_count, correct_count, score, time,
                                min,
                                max, add, sub, mult, div)
VALUES ('3ff6b354-1063-40f6-b196-fa422723b978',
        4,
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
        false);

INSERT INTO game_sessions.data (game_session_id, user_id, limit_type,
                                questions_count, correct_count, score, time,
                                min,
                                max, add, sub, mult, div)
VALUES ('4ff6b354-1063-40f6-b196-fa422723b978',
        5,
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
        false);

INSERT INTO game_sessions.data (game_session_id, user_id, limit_type,
                                questions_count, correct_count, score, time,
                                min,
                                max, add, sub, mult, div)
VALUES ('5ff6b354-1063-40f6-b196-fa422723b978',
        6,
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
        false);