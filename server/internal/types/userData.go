package types

type UserID uint

type UserData struct {
	FirstName     string `json:"first_name"`
	LastName      string `json:"last_name"`
	Username      string `json:"username"`
	Password      string `json:"password"`
	Salt          string `json:"salt"`
	Role          string `json:"role"`
	GameSessionID string `json:"game_session_id"`
	UserID        UserID `json:"user_id"`
}
