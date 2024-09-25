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
		userData, err := db.GetUserDataByUserID(userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}

		// check role
		if userData.Role != "S" {
			// bind payload
			var payload getUserInfoPayload
			if err = ctx.BindJSON(&payload); err != nil {
				fmt.Fprintf(os.Stderr, "error binding request body %+v\n", err)
				ctx.Status(http.StatusInternalServerError)
				return
			}

			// if sending specific userID
			if payload.UserID != 0 {
				// get user data for specified userID
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

				// succesful, set userID & userData to specified
				userID = payload.UserID
				userData = fetchedUserData
			}
		}

		sessions, err := db.GetGameSessionsByUserID(userID)
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
