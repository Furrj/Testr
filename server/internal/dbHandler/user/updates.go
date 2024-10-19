package user

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// UPDATES

const EUpdateVerticalByUserID = `
	UPDATE users.data
	SET vertical=$2
	WHERE user_id=$1
`

func UpdateVerticalByUserID(db *dbHandler.DBHandler, id types.UserID, vertical bool) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EUpdateVerticalByUserID,
		id,
		vertical,
	)
	if err != nil {
		return err
	}
	return nil
}

const EUpdatePasswordAndSaltByUserID = `
	UPDATE users.data
	SET password=$2, salt=$3
	WHERE user_id=$1
`

func UpdatePasswordAndSaltByUserID(db *dbHandler.DBHandler, id types.UserID, password, salt string) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EUpdatePasswordAndSaltByUserID,
		id,
		password,
		salt,
	)
	if err != nil {
		return err
	}
	return nil
}
