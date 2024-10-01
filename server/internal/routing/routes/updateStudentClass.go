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

type updateStudentClassPayload struct {
	UserID  types.UserID `json:"user_id"`
	ClassID uint         `json:"class_id"`
}

func UpdateStudentClass(db *dbHandler.DBHandler) gin.HandlerFunc {
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
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check role
		if userData.Role == "S" {
			ctx.Status(http.StatusUnauthorized)
		}

		// bind payload
		var payload updateStudentClassPayload
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Printf("Error binding json: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// get user data
		fetchedUserData, err := db.GetUserDataByUserID(payload.UserID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check if student
		if fetchedUserData.Role != "S" {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// check if student owned by teacher
		studentData, err := db.GetStudentDataByUserID(payload.UserID)
		if studentData.TeacherID != userID {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// update update class
		if err := db.UpdateStudentClassIDByUserID(payload.UserID, payload.ClassID); err != nil {
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.Status(http.StatusOK)
	}
}
