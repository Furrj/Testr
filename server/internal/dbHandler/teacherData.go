package dbHandler

import (
	"context"

	"mathtestr.com/server/internal/types"
)

const QGetTeacherDataByUserID = `
	SELECT user_id, email, school
	FROM teachers.data
	WHERE user_id=$1
`

func (dbHandler *DBHandler) GetTeacherDataByUserID(UserID types.UserID) (types.TeacherData, error) {
	var TeacherData types.TeacherData
	err := dbHandler.Conn.QueryRow(
		context.Background(),
		QGetTeacherDataByUserID,
		UserID,
	).Scan(
		&TeacherData.UserID,
		&TeacherData.Email,
		&TeacherData.School,
	)
	if err != nil {
		return TeacherData, err
	}
	return TeacherData, nil
}

const QGetTeacherClassByClassID = `
	SELECT class_id, teacher_id, name
	FROM teachers.classes
	WHERE class_id=$1
`

func (dbHandler *DBHandler) GetTeacherClassByClassID(classID uint) (types.TeacherClass, error) {
	var class types.TeacherClass

	err := dbHandler.Conn.QueryRow(
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

func (dbHandler *DBHandler) GetTeacherClassesByUserID(id types.UserID) ([]types.TeacherClass, error) {
	classes := []types.TeacherClass{}

	rows, err := dbHandler.Conn.Query(
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

// Inserts

const EInsertTeacherData = `
	INSERT INTO teachers.data(user_id, email, school)
	VALUES ($1, $2, $3)
`

func (dbHandler *DBHandler) InsertTeacherData(teacherData types.TeacherData) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertTeacherData,
		teacherData.UserID,
		teacherData.Email,
		teacherData.School,
	)
	if err != nil {
		return err
	}
	return nil
}

const EInsertTeacherClass = `
	INSERT INTO teachers.classes(teacher_id, name)
	VALUES ($1, $2)
`

func (dbHandler *DBHandler) InsertTeacherClass(userID types.UserID, class types.TeacherClass) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertTeacherClass,
		userID,
		class.Name,
	)
	if err != nil {
		return err
	}
	return nil
}
