package dbHandler

import (
	"context"

	"mathtestr.com/server/internal/types"
)

const QGetStudentDataByUserID = `
	SELECT user_id, teacher_id, class_id
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
		&StudentData.ClassID,
	)
	if err != nil {
		return StudentData, err
	}
	return StudentData, nil
}

const QGetAllStudentsDataByTeacherID = `
	SELECT user_id, teacher_id, class_id, first_name, last_name, username
	FROM students.data
	NATURAL JOIN users.data
	WHERE teacher_id=$1
`

func (dbHandler *DBHandler) GetAllStudentsDataByTeacherID(UserID types.UserID) ([]types.StudentData, error) {
	students := []types.StudentData{}

	rows, err := dbHandler.Conn.Query(
		context.Background(),
		QGetAllStudentsDataByTeacherID,
		UserID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var student types.StudentData

		err := rows.Scan(
			&student.UserID,
			&student.TeacherID,
			&student.ClassID,
			&student.FirstName,
			&student.LastName,
			&student.Username,
		)
		if err != nil {
			return nil, err
		}
		students = append(students, student)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return students, nil
}

// Inserts

const EInsertStudentData = `
	INSERT INTO students.data(user_id, teacher_id, class_id)
	VALUES ($1, $2, $3)
`

func (dbHandler *DBHandler) InsertStudentData(studentData types.StudentData) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertStudentData,
		studentData.UserID,
		studentData.TeacherID,
		studentData.ClassID,
	)
	if err != nil {
		return err
	}
	return nil
}
