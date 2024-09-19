package dbHandler

import (
	"context"

	"mathtestr.com/server/internal/types"
)

const QGetStudentDataByUserID = `
	SELECT user_id, teacher_id, period
	FROM students.data
	WHERE user_id=$1
`

func (dbHandler *DBHandler) GetStudentDataByUserID(UserID types.UserID) (types.StudentData, error) {
	var StudentData types.StudentData
	err := dbHandler.Conn.QueryRow(
		context.Background(),
		QGetStudentDataByUserID,
		UserID,
	).Scan(
		&StudentData.UserID,
		&StudentData.TeacherID,
		&StudentData.Period,
	)
	if err != nil {
		return StudentData, err
	}
	return StudentData, nil
}

// Inserts

const EInsertStudentData = `
	INSERT INTO students.data(user_id, teacher_id, period)
	VALUES ($1, $2, $3)
`

func (dbHandler *DBHandler) InsertStudentData(studentData types.StudentData) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertStudentData,
		studentData.UserID,
		studentData.TeacherID,
		studentData.Period,
	)
	if err != nil {
		return err
	}
	return nil
}
