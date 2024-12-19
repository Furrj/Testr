-- name: GetUserDataByUserId :one
SELECT *
FROM users.data
WHERE user_id = $1;

-- name: GetUserDataByUsername :one
SELECT *
FROM users.data
WHERE username = $1;

-- name: CreateUser :one
INSERT INTO users.ids DEFAULT VALUES
RETURNING user_id;

-- name: InsertUserData :one
INSERT INTO users.data (user_id, username, password, salt, first_name, last_name, role, vertical)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING user_id;
