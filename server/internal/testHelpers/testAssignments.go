package testHelpers

import (
	"github.com/google/uuid"
	"mathtestr.com/server/internal/types"
)

var TestAssignment = types.Assignment{
	Name:         "Quiz 1",
	AssignmentID: uuid.MustParse("e9a6851c-3650-43a0-a670-23a8d5cf2a31"),
	Classes:      []uint{1},
	DBGameSessionSettings: types.DBGameSessionSettings{
		Min:         -2,
		LimitType:   2,
		LimitAmount: 20,
		Max:         4,
		Add:         false,
		Sub:         false,
		Mult:        true,
		Div:         false,
	},
	Due:       1730534645,
	TeacherID: 1,
	IsActive:  true,
}

var TestAssignmentClass types.DBAssignmentClass = types.DBAssignmentClass{
	AssignmentID: uuid.MustParse("e9a6851c-3650-43a0-a670-23a8d5cf2a31"),
	ClassID:      1,
}
