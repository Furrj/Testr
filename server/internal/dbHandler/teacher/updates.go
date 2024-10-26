package teacher

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

const uUpdateTeacherRegistrationByTeacherId = `
	UPDATE teachers.validation_codes
	SET code=$2, issued_at=$3
	WHERE teacher_id=$1
`

func UpdateTeacherRegistrationByTeacherId(db *dbHandler.DBHandler, r types.TeacherRegistration) error {
	_, err := db.Conn.Exec(
		context.Background(),
		uUpdateTeacherRegistrationByTeacherId,
		r.TeacherID,
		r.Code,
		r.IssuedAt,
	)
	if err != nil {
		return err
	}
	return nil
}

const uUpdateTeacherValidationStatusByTeacherId = `
	UPDATE teachers.data
	SET is_validated=$2
	WHERE user_id=$1
`

func UpdateTeacherValidationStatusByTeacherId(db *dbHandler.DBHandler, id types.UserID, status bool) error {
	_, err := db.Conn.Exec(
		context.Background(),
		uUpdateTeacherValidationStatusByTeacherId,
		id,
		status,
	)
	if err != nil {
		return err
	}
	return nil
}
