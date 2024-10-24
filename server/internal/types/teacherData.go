package types

import "github.com/google/uuid"

type TeacherData struct {
	Email    string `json:"email"`
	School   string `json:"school"`
	UserID   UserID `json:"user_id"`
	IsActive bool   `json:"is_active"`
}

type TeacherClass struct {
	Name      string `json:"name"`
	ClassID   uint   `json:"class_id"`
	TeacherID UserID `json:"teacher_id"`
}

type TeacherRegistration struct {
	Email  string    `json:"email"`
	UserID UserID    `json:"user_id"`
	Expiry int       `json:"expiry"`
	Code   uuid.UUID `json:"code"`
}
