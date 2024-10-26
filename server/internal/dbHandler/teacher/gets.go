package teacher

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

const QGetTeacherDataByUserID = `
	SELECT user_id, email, school, is_active, is_validated
	FROM teachers.data
	WHERE user_id=$1
`

func GetTeacherDataByUserID(db *dbHandler.DBHandler, UserID types.UserID) (types.TeacherData, error) {
	var t types.TeacherData
	err := db.Conn.QueryRow(
		context.Background(),
		QGetTeacherDataByUserID,
		UserID,
	).Scan(
		&t.UserID,
		&t.Email,
		&t.School,
		&t.IsActive,
		&t.IsValidated,
	)
	if err != nil {
		return t, err
	}
	return t, nil
}

const QGetTeacherDataByEmail = `
	SELECT user_id, school, is_active, is_validated
	FROM teachers.data
	WHERE email=$1
`

func GetTeacherDataByEmail(db *dbHandler.DBHandler, email string) (types.TeacherData, error) {
	t := types.TeacherData{
		Email: email,
	}
	err := db.Conn.QueryRow(
		context.Background(),
		QGetTeacherDataByEmail,
		email,
	).Scan(
		&t.UserID,
		&t.School,
		&t.IsActive,
		&t.IsValidated,
	)
	if err != nil {
		return t, err
	}
	return t, nil
}

const QGetTeacherClassByClassID = `
	SELECT class_id, teacher_id, name
	FROM teachers.classes
	WHERE class_id=$1
`

func GetTeacherClassByClassID(db *dbHandler.DBHandler, classID uint) (types.TeacherClass, error) {
	var class types.TeacherClass

	err := db.Conn.QueryRow(
		context.Background(),
		QGetTeacherClassByClassID,
		classID,
	).Scan(
		&class.ClassID,
		&class.TeacherID,
		&class.Name,
	)
	if err != nil {
		return class, err
	}

	return class, nil
}

const QGetTeacherClassesByUserID = `
	SELECT class_id, name
	FROM teachers.classes
	WHERE teacher_id=$1
	ORDER BY class_id
`

func GetTeacherClassesByUserID(db *dbHandler.DBHandler, id types.UserID) ([]types.TeacherClass, error) {
	classes := []types.TeacherClass{}

	rows, err := db.Conn.Query(
		context.Background(),
		QGetTeacherClassesByUserID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var class types.TeacherClass

		err = rows.Scan(
			&class.ClassID,
			&class.Name,
		)
		if err != nil {
			return nil, err
		}

		class.TeacherID = id
		classes = append(classes, class)
	}

	if err = rows.Err(); err != nil {
		return nil, err
	}

	return classes, nil
}

const QGetTeacherClassPopulationByClassID = `
	SELECT COUNT(*)
	FROM students.data
	WHERE class_id=$1
`

func GetTeacherClassPopulationByClassID(db *dbHandler.DBHandler, classID uint) (uint, error) {
	var pop uint

	err := db.Conn.QueryRow(
		context.Background(),
		QGetTeacherClassPopulationByClassID,
		classID,
	).Scan(&pop)
	if err != nil {
		return pop, err
	}

	return pop, nil
}

const qGetTeacherRegistrationByTeacherId = `
	SELECT code, issued_at
	FROM teachers.validation_codes
	WHERE teacher_id=$1
`

func GetTeacherRegistrationByTeacherId(db *dbHandler.DBHandler, id types.UserID) (types.TeacherRegistration, error) {
	var t types.TeacherRegistration

	err := db.Conn.QueryRow(
		context.Background(),
		qGetTeacherRegistrationByTeacherId,
		id,
	).Scan(
		&t.Code,
		&t.IssuedAt,
	)
	if err != nil {
		return t, err
	}
	return t, nil
}
