package routes

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

func SubmitGameSession(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// bind payload
		var payload types.RequestSubmitGameSession
		if err = ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding request body %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// spawn game session
		gameSessionID, err := utils.CreateNewGameSessionID(db)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error spawning game session: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		session := types.GameSession{
			GameSessionID:  gameSessionID,
			UserID:         userID,
			LimitType:      payload.LimitType,
			QuestionsCount: payload.QuestionsCount,
			CorrectCount:   payload.CorrectCount,
			Score:          payload.Score,
			Time:           payload.Time,
			Min:            payload.Min,
			Max:            payload.Max,
			Add:            payload.Add,
			Sub:            payload.Sub,
			Mult:           payload.Mult,
			Div:            payload.Div,
		}
		if err = db.InsertGameSessionData(session); err != nil {
			fmt.Fprintf(os.Stderr, "error inserting game session: %+v\n", err)
		}

		ctx.Status(http.StatusOK)
	}
}
