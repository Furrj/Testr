package user

import (
	"context"

	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

const QGetUserIDByUsername = `
	SELECT user_id FROM users.data WHERE LOWER(username)=LOWER($1)
`

func GetUserIDByUsername(db *dbHandler.DBHandler, username string) (types.UserID, error) {
	var id types.UserID
	err := db.Conn.QueryRow(context.Background(), QGetUserIDByUsername, username).Scan(&id)
	if err != nil {
		return 0, err
	}
	return id, nil
}

const QGetUserDataByUserID = `
	SELECT user_id, username, password, salt, first_name, last_name, role, vertical
	FROM users.data
	WHERE user_id=$1
`

func GetUserDataByUserID(db *dbHandler.DBHandler, UserID types.UserID) (types.UserData, error) {
	var UserData types.UserData
	err := db.Conn.QueryRow(context.Background(), QGetUserDataByUserID, UserID).Scan(
		&UserData.UserID,
		&UserData.Username,
		&UserData.Password,
		&UserData.Salt,
		&UserData.FirstName,
		&UserData.LastName,
		&UserData.Role,
		&UserData.Vertical,
	)
	if err != nil {
		return UserData, err
	}
	return UserData, nil
}

const QGetPasswordResetCodeByCode = `
	SELECT user_id, code
	FROM users.password_reset_codes
	WHERE code=$1
`

func GetPasswordResetCodeByCode(db *dbHandler.DBHandler, code string) (types.PasswordResetCode, error) {
	var rc types.PasswordResetCode

	err := db.Conn.QueryRow(
		context.Background(),
		QGetPasswordResetCodeByCode,
		code,
	).Scan(
		&rc.UserID,
		&rc.Code,
	)
	if err != nil {
		return rc, err
	}
	return rc, nil
}

const QGetPasswordResetCodeByUserID = `
	SELECT code
	FROM users.password_reset_codes
	WHERE user_id=$1
`

func GetPasswordResetCodeByUserID(db *dbHandler.DBHandler, id types.UserID) (string, error) {
	var code string

	err := db.Conn.QueryRow(
		context.Background(),
		QGetPasswordResetCodeByUserID,
		id,
	).Scan(
		&code,
	)
	if err != nil {
		if err == pgx.ErrNoRows {
			return "", nil
		}
		return code, err
	}
	return code, nil
}

const qGetContactInfoByUserId = `
	SELECT email, password
	FROM users.contact_info
	WHERE user_id=$1
`

func GetContactInfoByUserId(db *dbHandler.DBHandler, id types.UserID) (types.ContactInfo, error) {
	ci := types.ContactInfo{
		UserId: id,
	}

	err := db.Conn.QueryRow(
		context.Background(),
		QGetPasswordResetCodeByUserID,
		id,
	).Scan(
		&ci.Email,
		&ci.Phone,
	)
	if err != nil {
		return ci, err
	}
	return ci, nil
}

const qGetValidationCodeByUserId = `
	SELECT code, issued_at
	FROM users.validation_codes
	WHERE user_id=$1
`

func GetValidationCodeByUserId(db *dbHandler.DBHandler, id types.UserID) (types.ValidationCode, error) {
	c := types.ValidationCode{
		UserId: id,
	}

	err := db.Conn.QueryRow(
		context.Background(),
		qGetValidationCodeByUserId,
		id,
	).Scan(
		&c.Code,
		&c.IssuedAt,
	)
	if err != nil {
		return c, err
	}
	return c, nil
}

const qGetAccountStatusByUserId = `
	SELECT is_active, is_validated 
	FROM users.account_status
	WHERE user_id=$1
`

func GetAccountStatusByUserId(db *dbHandler.DBHandler, id types.UserID) (types.AccountStatus, error) {
	s := types.AccountStatus{
		UserId: id,
	}

	err := db.Conn.QueryRow(
		context.Background(),
		qGetAccountStatusByUserId,
		id,
	).Scan(
		&s.IsActive,
		&s.IsValidated,
	)
	if err != nil {
		return s, err
	}
	return s, nil
}
