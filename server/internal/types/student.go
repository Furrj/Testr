package types

type StudentData struct {
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Username  string `json:"username"`
	UserID    UserID `json:"user_id"`
	TeacherID UserID `json:"teacher_id"`
	ClassID   uint   `json:"class_id"`
}
