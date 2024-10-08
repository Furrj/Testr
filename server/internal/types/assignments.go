package types

import "github.com/google/uuid"

type Assignment struct {
	Name         string    `json:"name"`
	Classes      []uint    `json:"classes"`
	LimitAmount  uint      `json:"limit_amount"`
	Due          uint      `json:"due"`
	LimitType    uint      `json:"limit_type"`
	Min          int       `json:"min"`
	TeacherID    UserID    `json:"teacher_id"`
	Max          int       `json:"max"`
	SettingsID   uuid.UUID `json:"settings_id"`
	AssignmentID uuid.UUID `json:"assignment_id"`
	Add          bool      `json:"add"`
	Sub          bool      `json:"sub"`
	Mult         bool      `json:"mult"`
	Div          bool      `json:"div"`
	IsActive     bool      `json:"is_active"`
}

type DBAssignmentClass struct {
	AssignmentID uuid.UUID `json:"assignment_id"`
	ClassID      uint      `json:"class_id"`
}
