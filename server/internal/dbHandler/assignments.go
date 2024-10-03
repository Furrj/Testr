package dbHandler

import (
	"context"

	"mathtestr.com/server/internal/types"
)

// GETS
const QGetAssignmentDataByAssignmentID = `
SELECT
		assignment_id,
    user_id,
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
WHERE
	assignment_id=$1
`

func (dbHandler *DBHandler) GetAssignmentDataByAssignmentID(id string) (types.DBAssignment, error) {
	var a types.DBAssignment

	err := dbHandler.Conn.QueryRow(
		context.Background(),
		QGetAssignmentDataByAssignmentID,
		id,
	).Scan(
		&a.AssignmentID,
		&a.UserID,
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

const QGetAllAssignmentDataByUserID = `
SELECT
		assignment_id,
    user_id,
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
WHERE
	user_id=$1
`

func (dbHandler *DBHandler) GetAllAssignmentsDataByUserID(id types.UserID) ([]types.DBAssignment, error) {
	assignments := []types.DBAssignment{}

	rows, err := dbHandler.Conn.Query(
		context.Background(),
		QGetAllAssignmentDataByUserID,
		id,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var a types.DBAssignment

		err := rows.Scan(
			&a.AssignmentID,
			&a.UserID,
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

func (dbHandler *DBHandler) GetAllAssignmentClassesByAssignmentID(id string) ([]uint, error) {
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
    user_id,
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
		)
	VALUES
		($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
`

func (dbHandler *DBHandler) InsertAssignment(a types.DBAssignment) error {
	_, err := dbHandler.Conn.Exec(
		context.Background(),
		EInsertAssignment,
		a.AssignmentID,
		a.UserID,
		a.Name,
		a.Due,
		a.LimitType,
		a.LimitAmount,
		a.Min,
		a.Max,
		a.Add,
		a.Sub,
		a.Mult,
		a.Div,
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
