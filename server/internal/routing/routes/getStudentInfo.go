package routes

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

func GetStudentInfo(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// get user data
		userData, err := db.GetUserDataByUserID(userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}

		// check role
		if userData.Role == "S" {
			ctx.Status(http.StatusUnauthorized)
		}

		// get param
		paramStr := ctx.Param("id")

		// Convert the string to a uint
		userParamID32, err := strconv.ParseUint(paramStr, 10, 32)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error parsing param string: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		userParamID := types.UserID(userParamID32)

		// get student data
		studentUserData, err := db.GetUserDataByUserID(userParamID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check if student
		if studentUserData.Role != "S" {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// check if student owned by teacher
		studentData, err := db.GetStudentDataByUserID(userParamID)
		if studentData.TeacherID != userID {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// get class
		class, err := db.GetTeacherClassByClassID(studentData.ClassID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetTeacherClassByClassID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// get sessions
		sessions, err := db.GetAllGameSessionsByUserID(studentData.UserID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetGameSessionsByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		res := types.ResponseGetStudentInfo{
			UserData: types.ResponseUserData{
				FirstName: studentUserData.FirstName,
				LastName:  studentUserData.LastName,
				Username:  studentUserData.Username,
				Role:      studentUserData.Role,
				UserID:    studentUserData.UserID,
			},
			Sessions: sessions,
			Class:    class,
		}

		ctx.JSON(http.StatusOK, res)
	}
}
