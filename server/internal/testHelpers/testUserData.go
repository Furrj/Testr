// Package testHelpers includes objects that can be internal across
// different unit tests
package testHelpers

import (
	"mathtestr.com/server/internal/types"
)

var TestUserDataJackson = types.UserData{
	UserID:    2,
	FirstName: "Jackson",
	LastName:  "Furr",
	Username:  "poemmys",
	Password:  "pass",
	Role:      "S",
	Vertical:  false,
}

var TestStudentData = types.StudentData{
	UserID:    2,
	TeacherID: 1,
	Period:    1,
}

var TestUserDataMichele = types.UserData{
	UserID:    1,
	FirstName: "Michele",
	LastName:  "Furr",
	Username:  "mfurr",
	Password:  "pass",
	Role:      "T",
	Vertical:  true,
}

var TestTeacherData = types.TeacherData{
	UserID:  1,
	Periods: 5,
}

var TestUserRegisterPayload = types.RequestPayloadRegister{
	Username:  "poemmys",
	Password:  "pass",
	FirstName: "Jackson",
	LastName:  "Furr",
}

var TestUserLoginPayload = types.RequestPayloadLogin{
	Username: "poemmys",
	Password: "pass",
}

var TestUserLoginPayloadInvalidPassword = types.RequestPayloadLogin{
	Username: "poemmys",
	Password: "invalid",
}

var TestUserLoginPayloadInvalidUsername = types.RequestPayloadLogin{
	Username: "invalid",
	Password: "pass",
}
