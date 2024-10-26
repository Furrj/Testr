package types

import "github.com/google/uuid"

type TeacherData struct {
	Email       string `json:"email"`
	School      string `json:"school"`
	UserID      UserID `json:"user_id"`
	IsActive    bool   `json:"is_active"`
	IsValidated bool   `json:"is_validated"`
}

type TeacherClass struct {
	Name      string `json:"name"`
	ClassID   uint   `json:"class_id"`
	TeacherID UserID `json:"teacher_id"`
}

type TeacherRegistration struct {
	TeacherID UserID    `json:"teacher_id"`
	IssuedAt  int       `json:"issued_at"`
	Code      uuid.UUID `json:"code"`
}
