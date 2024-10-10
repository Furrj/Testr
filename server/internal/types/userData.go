package types

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

type StudentData struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	UserID    UserID `json:"user_id"`
	TeacherID UserID `json:"teacher_id"`
	ClassID   uint   `json:"class_id"`
}

type PasswordResetCode struct {
	Code   string `json:"code"`
	UserID UserID `json:"user_id"`
}
