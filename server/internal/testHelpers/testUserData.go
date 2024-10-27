// Package testHelpers includes objects that can be internal across
// different unit tests
package testHelpers

import (
	"github.com/google/uuid"
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
	ClassID:   1,
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

var TestUserRegisterPayload = types.ReqRegister{
	Username:  "poemmys",
	Password:  "pass",
	FirstName: "Jackson",
	LastName:  "Furr",
}

var TestUserLoginPayload = types.ReqLogin{
	Username: "poemmys",
	Password: "pass",
}

var TestUserLoginPayloadInvalidPassword = types.ReqLogin{
	Username: "poemmys",
	Password: "invalid",
}

var TestUserLoginPayloadInvalidUsername = types.ReqLogin{
	Username: "invalid",
	Password: "pass",
}

var TestPasswordResetCode = types.PasswordResetCode{
	UserID: TestUserDataJackson.UserID,
	Code:   "1234",
}

var TestUserAccountStatus = types.AccountStatus{
	UserId:         1,
	IsActive:       false,
	MembershipType: 3,
}

var TestUserValidationCode = types.ValidationCode{
	UserId:   1,
	Code:     uuid.MustParse("8ff6b354-1063-40f6-b196-fa422723b971"),
	IssuedAt: 1,
}

var TestUserContactInfo = types.ContactInfo{
	UserId: 1,
	Email:  "a@a.com",
	Phone:  "678-186-7628",
}
