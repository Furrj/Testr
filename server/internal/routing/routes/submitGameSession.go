package routes

import (
	"fmt"
	"net/http"

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
			fmt.Printf("error in GetJwtInfoFromCtx %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// bind request body
		var req types.RequestSubmitGameSession
		if err = ctx.BindJSON(&req); err != nil {
			fmt.Printf("error binding request body %+v\n", err)
		}
		fmt.Printf("%+v\n", req)

		ctx.Status(http.StatusOK)
	}
}
