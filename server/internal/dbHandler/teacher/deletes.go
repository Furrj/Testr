package teacher

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

const dDeleteTeacherRegistrationByTeacherId = `
	DELETE FROM teachers.validation_codes
	WHERE teacher_id=$1
`

func DeleteTeacherRegistrationByTeacherId(db *dbHandler.DBHandler, id types.UserID) error {
	_, err := db.Conn.Exec(
		context.Background(),
		dDeleteTeacherRegistrationByTeacherId,
		id,
	)
	if err != nil {
		return err
	}
	return nil
}
