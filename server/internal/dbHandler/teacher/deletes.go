package teacher

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
)

const dDeleteTeacherRegistrationByEmail = `
	DELETE FROM teachers.registration
	WHERE email=$1
`

func DeleteTeacherRegistrationByEmail(db *dbHandler.DBHandler, email string) error {
	_, err := db.Conn.Exec(
		context.Background(),
		dDeleteTeacherRegistrationByEmail,
		email,
	)
	if err != nil {
		return err
	}
	return nil
}
