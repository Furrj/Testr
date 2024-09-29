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

func RegisterTeacher(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx: %+v\n", err)
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
		if userData.Role != "T" {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// bind request body
		var payload types.ReqRegisterTeacher
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding payload: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("%+v\n", payload)

		// insert teacher data
		teacherData := types.TeacherData{
			Email:  payload.Email,
			School: payload.School,
			UserID: userID,
		}
		if err := db.InsertTeacherData(teacherData); err != nil {
			fmt.Fprintf(os.Stderr, "error in InsertTeacherData: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// insert classes
		for _, c := range payload.Classes {
			if err := db.InsertTeacherClass(userID, c); err != nil {
				fmt.Fprintf(os.Stderr, "error in InsertTeacherClass: %+v\n", err)
				ctx.Status(http.StatusInternalServerError)
				return
			}
		}

		ctx.Status(http.StatusOK)
	}
}
