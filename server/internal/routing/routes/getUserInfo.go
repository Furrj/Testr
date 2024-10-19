package routes

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/gamesession"
	"mathtestr.com/server/internal/dbHandler/student"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

type getUserInfoPayload struct {
	UserID types.UserID `json:"user_id"`
}

func GetUserInfo(db *dbHandler.DBHandler) gin.HandlerFunc {
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
		userData, err := user.GetUserDataByUserID(db, userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}

		// check role
		if userData.Role != "S" {
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

			// if sending specific userID
			if userParamID != 0 {
				// get user data for specified userID
				fetchedUserData, err := user.GetUserDataByUserID(db, userParamID)
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
				studentData, err := student.GetStudentDataByUserID(db, userParamID)
				if studentData.TeacherID != userID {
					ctx.Status(http.StatusUnauthorized)
					return
				}

				// succesful, set userID & userData to specified
				userID = userParamID
				userData = fetchedUserData
			}
		}

		// get sessions
		sessions, err := gamesession.GetAllGameSessionsByUserID(db, userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetGameSessionsByUserID %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}

		res := types.ResponseGetUserData{
			UserData: types.ResponseUserData{
				FirstName: userData.FirstName,
				LastName:  userData.LastName,
				Username:  userData.Username,
				Role:      userData.Role,
				UserID:    userID,
			},
			Sessions: sessions,
		}

		ctx.JSON(http.StatusOK, res)
	}
}
