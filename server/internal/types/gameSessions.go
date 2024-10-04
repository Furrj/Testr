package types

import "github.com/google/uuid"

type GameSession struct {
	GameSessionID  uuid.UUID `json:"game_session_id"`
	Score          uint      `json:"score"`
	UserID         UserID    `json:"user_id"`
	LimitType      uint      `json:"limit_type"`
	QuestionsCount uint      `json:"questions_count"`
	CorrectCount   uint      `json:"correct_count"`
	Timestamp      uint      `json:"timestamp"`
	Time           uint      `json:"time"`
	Min            int       `json:"min"`
	Max            int       `json:"max"`
	Add            bool      `json:"add"`
	Sub            bool      `json:"sub"`
	Mult           bool      `json:"mult"`
	Div            bool      `json:"div"`
}
