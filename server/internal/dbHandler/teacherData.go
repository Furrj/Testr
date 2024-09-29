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
	SELECT class_id, name
	FROM teachers.classes
	WHERE user_id=$1
	ORDER BY class_id
`

func (dbHandler *DBHandler) GetTeacherClassesByUserID(UserID types.UserID) ([]types.TeacherClass, error) {
	classes := make([]types.TeacherClass, 0)

	rows, err := dbHandler.Conn.Query(
		context.Background(),
		QGetTeacherClassByUserID,
		UserID,
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

		classes = append(classes, class)
	}

	if err = rows.Err(); err != nil {
		return nil, err
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
