package types

import "github.com/google/uuid"

type Assignment struct {
	Name         string    `json:"name"`
	Classes      []uint    `json:"classes"`
	Due          uint      `json:"due"`
	TeacherID    UserID    `json:"teacher_id"`
	AssignmentID uuid.UUID `json:"assignment_id"`
	IsActive     bool      `json:"is_active"`
	DBGameSessionSettings
}

type DBAssignmentClass struct {
	AssignmentID uuid.UUID `json:"assignment_id"`
	ClassID      uint      `json:"class_id"`
}
