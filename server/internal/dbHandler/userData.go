package dbHandler

import (
	"context"

	"mathtestr.com/server/internal/types"
)

// Gets
const QGetUserIDByUsername = `
	SELECT user_id FROM users.data WHERE LOWER(username)=LOWER($1)
`

func (dbHandler *DBHandler) GetUserIDByUsername(username string) (types.UserID, error) {
	var id types.UserID
	err := dbHandler.Conn.QueryRow(context.Background(), QGetUserIDByUsername, username).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

const QGetUserDataByUserID = `
	SELECT user_id, username, password, salt, first_name, last_name, role
	FROM users.data
	WHERE user_id=$1
`

func (dbHandler *DBHandler) GetUserDataByUserID(UserID types.UserID) (types.UserData, error) {
	var UserData types.UserData
	err := dbHandler.Conn.QueryRow(context.Background(), QGetUserDataByUserID, UserID).Scan(
		&UserData.UserID,
		&UserData.Username,
		&UserData.Password,
		&UserData.Salt,
		&UserData.FirstName,
		&UserData.LastName,
		&UserData.Role,
	)
	if err != nil {
		return UserData, err
	}
	return UserData, nil
}

const QGetUserGameSessionByUserID = `
  SELECT game_session_id, user_id
	FROM users.game_session
	WHERE user_id=$1
`

func (dbHandler *DBHandler) GetUserGameSessionByUserID(userID types.UserID) (types.GameSession, error) {
	var gameSession types.GameSession

	err := dbHandler.Conn.QueryRow(context.Background(), QGetUserGameSessionByUserID, userID).Scan(
		&gameSession.GameSessionID,
		&gameSession.UserID,
	)
	if err != nil {
		return gameSession, err
	}

	return gameSession, nil
}

const QGetUserGameSessionIDByUserID = `
  SELECT game_session_id
  FROM users.game_session
  WHERE user_id=$1
`

func (dbHandler *DBHandler) GetUserGameSessionIDByUserID(userID types.UserID) (types.GameSessionID, error) {
	var gameSessionID types.GameSessionID
	if err := dbHandler.Conn.QueryRow(context.Background(), QGetUserGameSessionIDByUserID, userID).Scan(&gameSessionID); err != nil {
		return gameSessionID, err
	}

	return gameSessionID, nil
}

// Inserts

const EInsertUser = `
	INSERT INTO users.ids DEFAULT VALUES
	RETURNING user_id
`

func (dbHandler *DBHandler) InsertUser() (types.UserID, error) {
	var userID types.UserID
	err := dbHandler.Conn.QueryRow(context.Background(), EInsertUser).Scan(&userID)
	if err != nil {
		return userID, err
	}
	return userID, nil
}

const EInsertUserData = `
	INSERT INTO users.data (user_id, username, password, salt, first_name, last_name, role)
	VALUES ($1, $2, $3, $4, $5, $6, $7)
`

func (dbHandler *DBHandler) InsertUserData(userData types.UserData) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertUserData,
		userData.UserID,
		userData.Username,
		userData.Password,
		userData.Salt,
		userData.FirstName,
		userData.LastName,
		userData.Role,
	)
	if err != nil {
		return err
	}
	return nil
}

const EInsertUserGameSession = `
	INSERT INTO users.game_session (user_id, game_session_id)
	VALUES ($1, $2)
`

func (dbHandler *DBHandler) InsertUserGameSession(session types.GameSession) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertUserGameSession,
		session.UserID, session.GameSessionID)
	if err != nil {
		return err
	}
	return nil
}

// UPDATES

const EUpdateUserGameSessionByUserID = `
	UPDATE users.game_session
  SET game_session_id = $1
	WHERE user_id = $2
`

func (dbHandler *DBHandler) UpdateUserGameSessionByUserID(gameSessionID types.GameSessionID, userID types.UserID) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EUpdateUserGameSessionByUserID,
		gameSessionID,
		userID,
	)

	return err
}
