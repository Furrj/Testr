package teacher

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

// Inserts

const EInsertTeacherData = `
	INSERT INTO teachers.data(teacher_id, school)
	VALUES ($1, $2)
`

func InsertTeacherData(db *dbHandler.DBHandler, teacherData types.TeacherData) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertTeacherData,
		teacherData.TeacherID,
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

func InsertTeacherClass(db *dbHandler.DBHandler, id types.UserID, class types.TeacherClass) error {
	_, err := db.Conn.Exec(
		context.Background(),
		EInsertTeacherClass,
		id,
		class.Name,
	)
	if err != nil {
		return err
	}
	return nil
}
