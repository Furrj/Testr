package types

type GameSessionID = string

type GameSession struct {
	GameSessionID GameSessionID `json:"game_session_id"`
	UserID        UserID        `json:"user_id"`
}
