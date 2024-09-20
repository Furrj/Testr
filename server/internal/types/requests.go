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
	TeacherID string `json:"teacher_id,omitempty"`
}
