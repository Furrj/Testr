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
	_, err := dbHandler.Conn.Exec(context.Background(), EInsertUserData,
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
