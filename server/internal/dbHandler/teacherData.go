package dbHandler

import (
	"context"

	"mathtestr.com/server/internal/types"
)

const QGetTeacherDataByUserID = `
	SELECT user_id, periods
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
		&TeacherData.Periods,
	)
	if err != nil {
		return TeacherData, err
	}
	return TeacherData, nil
}

const QGetTeacherClassByUserID = `
	SELECT user_id, class_id, name
	FROM teachers.classes
	WHERE user_id=$1
`

func (dbHandler *DBHandler) GetTeacherClassByUserID(UserID types.UserID) (types.TeacherClass, error) {
	var classes types.TeacherClass

	err := dbHandler.Conn.QueryRow(
		context.Background(),
		QGetTeacherClassByUserID,
		UserID,
	).Scan(
		&classes.UserID,
		&classes.ClassID,
		&classes.Name,
	)
	if err != nil {
		return classes, err
	}

	return classes, nil
}

// Inserts

const EInsertTeacherData = `
	INSERT INTO teachers.data(user_id, periods)
	VALUES ($1, $2)
`

func (dbHandler *DBHandler) InsertTeacherData(teacherData types.TeacherData) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertTeacherData,
		teacherData.UserID,
		teacherData.Periods,
	)
	if err != nil {
		return err
	}
	return nil
}

const EInsertTeacherClass = `
	INSERT INTO teachers.classes(user_id, name)
	VALUES ($1, $2)
`

func (dbHandler *DBHandler) InsertTeacherClass(class types.TeacherClass) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertTeacherClass,
		class.UserID,
		class.Name,
	)
	if err != nil {
		return err
	}
	return nil
}
