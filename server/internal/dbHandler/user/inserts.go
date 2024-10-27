package user

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// INSERTS

const eCreateUser = `
	INSERT INTO users.ids DEFAULT VALUES
	RETURNING user_id
`

func CreateUser(db *dbHandler.DBHandler) (types.UserID, error) {
	var userID types.UserID
	err := db.Conn.QueryRow(context.Background(), eCreateUser).Scan(&userID)
	if err != nil {
		return userID, err
	}
	return userID, nil
}

const EInsertUserData = `
	INSERT INTO users.data (user_id, username, password, salt, first_name, last_name, role, vertical)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
`

func InsertUserData(db *dbHandler.DBHandler, userData types.UserData) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertUserData,
		userData.UserID,
		userData.Username,
		userData.Password,
		userData.Salt,
		userData.FirstName,
		userData.LastName,
		userData.Role,
		userData.Vertical,
	)
	if err != nil {
		return err
	}
	return nil
}

const eInsertPasswordResetCode = `
	INSERT INTO users.password_reset_codes (user_id, code)
	VALUES ($1, $2)
`

func InsertPasswordResetCode(db *dbHandler.DBHandler, c types.PasswordResetCode) error {
	_, err := db.Conn.Exec(
		context.Background(),
		eInsertPasswordResetCode,
		c.UserID,
		c.Code,
	)
	if err != nil {
		return err
	}
	return nil
}

const eInsertContactInfo = `
	INSERT INTO users.contact_info (user_id, email, phone)
	VALUES ($1, $2, $3)
`

func InsertContactInfo(db *dbHandler.DBHandler, ci types.ContactInfo) error {
	_, err := db.Conn.Exec(
		context.Background(),
		eInsertContactInfo,
		ci.UserId,
		ci.Email,
		ci.Phone,
	)
	if err != nil {
		return err
	}
	return nil
}

const eInsertValidationCode = `
	INSERT INTO users.validation_codes(user_id, code)
	VALUES ($1, $2)
`

func InsertValidationCode(db *dbHandler.DBHandler, c types.ValidationCode) error {
	_, err := db.Conn.Exec(
		context.Background(),
		eInsertValidationCode,
		c.UserId,
		c.Code,
	)
	if err != nil {
		return err
	}
	return nil
}

const eInsertAccountStatus = `
	INSERT INTO users.account_status(user_id, is_active, is_validated)
	VALUES ($1, $2, $3)
`

func InsertAccountStatus(db *dbHandler.DBHandler, s types.AccountStatus) error {
	_, err := db.Conn.Exec(
		context.Background(),
		eInsertAccountStatus,
		s.UserId,
		s.IsActive,
		s.IsValidated,
	)
	if err != nil {
		return err
	}
	return nil
}
