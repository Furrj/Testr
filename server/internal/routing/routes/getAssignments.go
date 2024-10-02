package routes

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/routing/utils"
)

func GetAssignments(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// get user data
		userData, err := db.GetUserDataByUserID(userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check role
		if userData.Role == "S" {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// get assignments
		a, err := db.GetAllAssignmentsDataByUserID(userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetAllAssignmentsDataByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.JSON(http.StatusOK, a)
	}
}
