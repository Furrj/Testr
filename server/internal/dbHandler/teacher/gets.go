package teacher

import (
	"context"

	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

const qGetTeacherDataByTeacherID = `
	SELECT teacher_id, school
	FROM teachers.data
	WHERE teacher_id=$1
`

func GetTeacherDataByTeacherID(db *dbHandler.DBHandler, UserID types.UserID) (types.TeacherData, error) {
	t := types.TeacherData{
		TeacherID: UserID,
	}
	err := db.Conn.QueryRow(
		context.Background(),
		qGetTeacherDataByTeacherID,
		UserID,
	).Scan(
		&t.TeacherID,
		&t.School,
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

const qGetTeacherClassesByTeacherID = `
	SELECT class_id, name
	FROM teachers.classes
	WHERE teacher_id=$1
	ORDER BY class_id
`

func GetTeacherClassesByTeacherID(db *dbHandler.DBHandler, id types.UserID) ([]types.TeacherClass, error) {
	classes := []types.TeacherClass{}

	rows, err := db.Conn.Query(
		context.Background(),
		qGetTeacherClassesByTeacherID,
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
