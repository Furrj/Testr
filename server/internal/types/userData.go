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
}

type TeacherData struct {
	UserID  UserID `json:"user_id"`
	Periods uint   `json:"periods"`
}

type StudentData struct {
	UserID    UserID `json:"user_id"`
	TeacherID UserID `json:"teacher_id"`
	Period    uint   `json:"period"`
}

type UserGameSessionData struct {
	GameSessionID string `json:"game_session_id"`
	UserID        UserID `json:"user_id"`
}
