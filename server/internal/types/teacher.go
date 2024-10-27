package types

type TeacherData struct {
	School string `json:"school"`
	UserID UserID `json:"user_id"`
}

type TeacherClass struct {
	Name      string `json:"name"`
	ClassID   uint   `json:"class_id"`
	TeacherID UserID `json:"teacher_id"`
}
