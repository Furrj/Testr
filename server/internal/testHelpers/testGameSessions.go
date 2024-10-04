package testHelpers

import (
	"github.com/google/uuid"
	"mathtestr.com/server/internal/types"
)

var TestGameSession = types.GameSession{
	Timestamp:      1727217444,
	GameSessionID:  uuid.MustParse("8ff6b354-1063-40f6-b196-fa422723b978"),
	UserID:         2,
	LimitType:      1,
	QuestionsCount: 10,
	CorrectCount:   7,
	Score:          70,
	Time:           60,
	Min:            -1,
	Max:            3,
	Add:            false,
	Sub:            false,
	Mult:           true,
	Div:            false,
}
