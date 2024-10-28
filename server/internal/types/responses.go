package types

type ResponseUserData struct {
	FirstName string        `json:"first_name"`
	LastName  string        `json:"last_name"`
	Username  string        `json:"username"`
	Role      string        `json:"role"`
	UserID    UserID        `json:"user_id"`
	Vertical  bool          `json:"vertical"`
	Account   AccountStatus `json:"account"`
}

type ResponseRegisterLogin struct {
	Tokens   AllTokens        `json:"tokens"`
	UserData ResponseUserData `json:"user_data"`
	Valid    bool             `json:"valid"`
}

type ResponseValidateSession struct {
	UserData ResponseUserData `json:"user_data"`
	Valid    bool             `json:"valid"`
}

type ResponseValidateToken struct {
	Valid bool `json:"valid"`
}

type ResponseGetUserData struct {
	Sessions []GameSession    `json:"sessions"`
	UserData ResponseUserData `json:"user_data"`
}

type ResponseGetStudentInfo struct {
	Sessions []GameSession    `json:"sessions"`
	Class    TeacherClass     `json:"class"`
	UserData ResponseUserData `json:"user_data"`
}
