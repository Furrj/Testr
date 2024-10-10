package types

import "github.com/google/uuid"

type GameSession struct {
	GameSessionID  uuid.UUID `json:"game_session_id"`
	Score          uint      `json:"score"`
	UserID         UserID    `json:"user_id"`
	QuestionsCount uint      `json:"questions_count"`
	CorrectCount   uint      `json:"correct_count"`
	Timestamp      uint      `json:"timestamp"`
	Time           uint      `json:"time"`
	DBGameSessionSettings
}

type DBGameSessionData struct {
	GameSessionID  uuid.UUID `json:"game_session_id"`
	SettingsID     uuid.UUID `json:"settings_id"`
	UserID         UserID    `json:"user_id"`
	Score          uint      `json:"score"`
	QuestionsCount uint      `json:"questions_count"`
	CorrectCount   uint      `json:"correct_count"`
	Timestamp      uint      `json:"timestamp"`
	Time           uint      `json:"time"`
}

type DBGameSessionSettings struct {
	SettingsID  uuid.UUID `json:"settings_id"`
	LimitType   uint      `json:"limit_type"`
	LimitAmount uint      `json:"limit_amount"`
	Min         int       `json:"min"`
	Max         int       `json:"max"`
	Add         bool      `json:"add"`
	Sub         bool      `json:"sub"`
	Mult        bool      `json:"mult"`
	Div         bool      `json:"div"`
}
