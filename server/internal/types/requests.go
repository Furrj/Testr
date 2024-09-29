package types

type ReqLogin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ReqRegister struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role"`
	TeacherID UserID `json:"teacher_id,omitempty"`
	Period    uint   `json:"period,omitempty"`
	Periods   uint   `json:"periods,omitempty"`
}

type ReqRegisterTeacher struct {
	Username  string         `json:"username"`
	Password  string         `json:"password"`
	FirstName string         `json:"first_name"`
	LastName  string         `json:"last_name"`
	School    string         `json:"school"`
	Email     string         `json:"email"`
	Classes   []TeacherClass `json:"classes"`
}

type RequestSubmitGameSession struct {
	LimitType      uint `json:"limit_type"`
	QuestionsCount uint `json:"questions_count"`
	CorrectCount   uint `json:"correct_count"`
	Score          uint `json:"score"`
	Time           uint `json:"time"`
	Min            int  `json:"min"`
	Max            int  `json:"max"`
	Add            bool `json:"add"`
	Sub            bool `json:"sub"`
	Mult           bool `json:"mult"`
	Div            bool `json:"div"`
}
