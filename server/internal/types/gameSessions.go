package types

import "time"

type GameSessionID = string

type GameSession struct {
	Timestamp     time.Time     `json:"timestamp"`
	GameSessionID GameSessionID `json:"game_session_id"`
	UserID        UserID        `json:"user_id"`
}
