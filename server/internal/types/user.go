package types

import (
	"github.com/google/uuid"
)

type UserID uint

type UserData struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	Password  string `json:"password"`
	Salt      string `json:"salt"`
	Role      string `json:"role"`
	UserID    UserID `json:"user_id"`
	Vertical  bool   `json:"vertical"`
}

type PasswordResetCode struct {
	Code   string `json:"code"`
	UserID UserID `json:"user_id"`
}

const (
	MembershipTypeUnvalidated = iota
	MembershipTypeValidated
	MembershipTypeBasic
	MembershipTypePremium
)

type AccountStatus struct {
	UserId         UserID `json:"user_id"`
	IsActive       bool   `json:"is_active"`
	MembershipType uint   `json:"membership_type"`
}

type ContactInfo struct {
	Email  string `json:"email"`
	Phone  string `json:"phone"`
	UserId UserID `json:"user_id"`
}

type ValidationCode struct {
	UserId   UserID    `json:"user_id"`
	IssuedAt int       `json:"issued_at"`
	Code     uuid.UUID `json:"code"`
}
