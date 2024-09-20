package types

type RequestPayloadLogin struct {
	Username string `json:"username"`
	Password string `json:"password"`
}
