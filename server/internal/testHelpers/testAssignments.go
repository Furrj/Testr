package testHelpers

import "mathtestr.com/server/internal/types"

var TestAssignment types.DBAssignment = types.DBAssignment{
	Name:         "Quiz 1",
	AssignmentID: "e9a6851c-3650-43a0-a670-23a8d5cf2a31",
	Min:          -2,
	LimitType:    2,
	LimitAmount:  20,
	Due:          1730534645,
	UserID:       1,
	Max:          4,
	Add:          false,
	Sub:          false,
	Mult:         true,
	Div:          false,
	IsActive:     true,
}

var TestAssignmentClass types.DBAssignmentClass = types.DBAssignmentClass{
	AssignmentID: "e9a6851c-3650-43a0-a670-23a8d5cf2a31",
	ClassID:      1,
}
