-- name: GetUserDataByUserId :one
SELECT *
FROM users.data
WHERE user_id = $1;

-- name: GetUserDataByUsername :one
SELECT *
FROM users.data
WHERE username = $1;

-- name: CreateUser :one
INSERT INTO users.ids DEFAULT
VALUES
RETURNING user_id;
