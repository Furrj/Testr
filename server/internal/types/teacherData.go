package types

type TeacherData struct {
	UserID  UserID `json:"user_id"`
	Periods uint   `json:"periods"`
}

type TeacherClass struct {
	Name    string `json:"name"`
	UserID  UserID `json:"user_id"`
	ClassID uint   `json:"class_id"`
}
