package testHelpers

import (
	"github.com/google/uuid"
	"mathtestr.com/server/internal/types"
)

var TestTeacherData = types.TeacherData{
	UserID: 1,
	Email:  "mfurr@bca.edu",
	School: "BCA",
}

var TestTeacherClass = types.TeacherClass{
	ClassID: 1,
	Name:    "testclass",
}

var TestTeacherRegistration = types.TeacherRegistration{
	Email:       "jackson.a.furr@gmail.com",
	IsValidated: false,
	Code:        uuid.MustParse("8ff6b354-1063-40f6-b196-fa422723b971"),
}
