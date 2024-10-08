package dbHandler

import (
	"context"

	"github.com/google/uuid"
	"mathtestr.com/server/internal/types"
)

// GETS
const QGetAssignmentByAssignmentID = `
SELECT
		assignment_id,
    teacher_id,
    name,
    due,
    limit_type,
    limit_amount,
    min,
    max,
    add,
    sub,
    mult,
    div,
    is_active
FROM
	assignments.data
NATURAL JOIN
	game_sessions.settings
WHERE
	assignment_id=$1
`

func (dbHandler *DBHandler) GetAssignmentByAssignmentID(id string) (types.Assignment, error) {
	var a types.Assignment

	err := dbHandler.Conn.QueryRow(
		context.Background(),
		QGetAssignmentByAssignmentID,
		id,
	).Scan(
		&a.AssignmentID,
		&a.TeacherID,
		&a.Name,
		&a.Due,
		&a.LimitType,
		&a.LimitAmount,
		&a.Min,
		&a.Max,
		&a.Add,
		&a.Sub,
		&a.Mult,
		&a.Div,
		&a.IsActive,
	)
	if err != nil {
		return a, err
	}

	return a, nil
}

const QGetAllAssignmentsByTeacherID = `
SELECT
		assignment_id,
    teacher_id,
    name,
    due,
    limit_type,
    limit_amount,
    min,
    max,
    add,
    sub,
    mult,
    div,
    is_active
FROM
	assignments.data
NATURAL JOIN
	game_sessions.settings
WHERE
	teacher_id=$1
`

func (dbHandler *DBHandler) GetAllAssignmentsByTeacherID(id types.UserID) ([]types.Assignment, error) {
	assignments := []types.Assignment{}

	rows, err := dbHandler.Conn.Query(
		context.Background(),
		QGetAllAssignmentsByTeacherID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var a types.Assignment

		err := rows.Scan(
			&a.AssignmentID,
			&a.TeacherID,
			&a.Name,
			&a.Due,
			&a.LimitType,
			&a.LimitAmount,
			&a.Min,
			&a.Max,
			&a.Add,
			&a.Sub,
			&a.Mult,
			&a.Div,
			&a.IsActive,
		)
		if err != nil {
			return nil, err
		}

		assignments = append(assignments, a)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return assignments, nil
}

const QGetAllAssignmentClassesByAssignmentID = `
	SELECT class_id
	FROM assignments.classes
	WHERE assignment_id=$1
`

func (dbHandler *DBHandler) GetAllAssignmentClassesByAssignmentID(id uuid.UUID) ([]uint, error) {
	ids := []uint{}

	rows, err := dbHandler.Conn.Query(
		context.Background(),
		QGetAllAssignmentClassesByAssignmentID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var a uint

		err := rows.Scan(&a)
		if err != nil {
			return nil, err
		}

		ids = append(ids, a)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}

	return ids, nil
}

// INSERTS
const EInsertAssignment = `
	INSERT INTO assignments.data
		(
		assignment_id,
    teacher_id,
		settings_id,
    name,
    due,
   	is_active
		)
	VALUES
		($1, $2, $3, $4, $5, $6) 
`

func (dbHandler *DBHandler) InsertAssignment(a types.Assignment) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertAssignment,
		a.AssignmentID,
		a.TeacherID,
		a.SettingsID,
		a.Name,
		a.Due,
		a.IsActive,
	)
	if err != nil {
		return err
	}

	return nil
}

const EInsertAssignmentClass = `
	INSERT INTO assignments.classes (assignment_id, class_id)
	VALUES ($1, $2)
`

func (dbHandler *DBHandler) InsertAssignmentClass(c types.DBAssignmentClass) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertAssignmentClass,
		c.AssignmentID,
		c.ClassID,
	)
	if err != nil {
		return err
	}

	return nil
}
