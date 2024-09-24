package types

import "time"

type GameSessionID = string

type GameSession struct {
	Timestamp      time.Time     `json:"timestamp"`
	GameSessionID  GameSessionID `json:"game_session_id"`
	UserID         UserID        `json:"user_id"`
	LimitType      uint          `json:"limit_type"`
	QuestionsCount uint          `json:"questions_count"`
	CorrectCount   uint          `json:"correct_count"`
	Score          uint          `json:"score"`
	Min            int           `json:"min"`
	Max            int           `json:"max"`
	Add            bool          `json:"add"`
	Sub            bool          `json:"sub"`
	Mult           bool          `json:"mult"`
	Div            bool          `json:"div"`
}
