package dbHandler

import (
	"context"

	"mathtestr.com/server/internal/types"
)

// GETS

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
