package teacher

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

const uUpdateTeacherRegistrationByEmail = `
	UPDATE teachers.registration
	SET code=$2, expiry=$3
	WHERE email=$1
`

func UpdateTeacherRegistrationByEmail(db *dbHandler.DBHandler, r types.TeacherRegistration) error {
	_, err := db.Conn.Exec(
		context.Background(),
		uUpdateTeacherRegistrationByEmail,
		r.Email,
		r.Code,
		r.Expiry,
	)
	if err != nil {
		return err
	}
	return nil
}
