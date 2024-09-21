package types

type RequestPayloadLogin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type RequestPayloadRegister struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Role      string `json:"role"`
	TeacherID UserID `json:"teacher_id,omitempty"`
	Period    uint   `json:"period,omitempty"`
	Periods   uint   `json:"periods,omitempty"`
}
