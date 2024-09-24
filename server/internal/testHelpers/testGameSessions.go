package testHelpers

import (
	"time"

	"mathtestr.com/server/internal/types"
)

var TestGameSession = types.GameSession{
	Timestamp:      time.Time{},
	GameSessionID:  "8ff6b354-1063-40f6-b196-fa422723b978",
	UserID:         2,
	LimitType:      1,
	QuestionsCount: 10,
	CorrectCount:   7,
	Score:          70,
	Min:            -1,
	Max:            3,
	Add:            false,
	Sub:            false,
	Mult:           true,
	Div:            false,
}
