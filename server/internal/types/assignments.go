package types

type DBAssignment struct {
	Name         string `json:"name"`
	AssignmentID string `json:"assignment_id"`
	Min          int    `json:"min"`
	LimitType    uint   `json:"limit_type"`
	LimitAmount  uint   `json:"limit_amount"`
	Due          uint   `json:"due"`
	UserID       UserID `json:"user_id"`
	Max          int    `json:"max"`
	Add          bool   `json:"add"`
	Sub          bool   `json:"sub"`
	Mult         bool   `json:"mult"`
	Div          bool   `json:"div"`
	IsActive     bool   `json:"is_active"`
}

type DBAssignmentClass struct {
	AssignmentID string `json:"assignment_id"`
	ClassID      uint   `json:"class_id"`
}
