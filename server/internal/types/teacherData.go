package types

type TeacherData struct {
	Email  string `json:"email"`
	School string `json:"school"`
	UserID UserID `json:"user_id"`
}

type TeacherClass struct {
	Name    string `json:"name"`
	ClassID uint   `json:"class_id"`
	UserID  UserID `json:"user_id"`
}
