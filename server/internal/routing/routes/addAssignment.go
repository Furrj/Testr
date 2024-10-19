package routes

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

func AddAssignment(db *dbHandler.DBHandler) gin.HandlerFunc {
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
		userData, err := user.GetUserDataByUserID(db, userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check role
		if userData.Role == "S" {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// bind payload
		var payload types.Assignment
		if err = ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding request body %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("payload: %+v\n", payload)

		// insert assignment
		id, err := uuid.NewRandom()
		if err != nil {
			fmt.Fprintf(os.Stderr, "error generating uuid: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		a := types.Assignment{
			Name:         payload.Name,
			AssignmentID: id,
			DBGameSessionSettings: types.DBGameSessionSettings{
				Min:         payload.Min,
				LimitType:   payload.LimitType,
				LimitAmount: payload.LimitAmount,
				Max:         payload.Max,
				Add:         payload.Add,
				Sub:         payload.Sub,
				Mult:        payload.Mult,
				Div:         payload.Div,
			},
			Due:       payload.Due,
			TeacherID: userID,
			IsActive:  true,
		}
		if err := db.InsertAssignment(a); err != nil {
			fmt.Fprintf(os.Stderr, "error in InsertAssignment: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// insert assignment classes
		for _, v := range payload.Classes {
			if err := db.InsertAssignmentClass(types.DBAssignmentClass{
				AssignmentID: id,
				ClassID:      v,
			}); err != nil {
				fmt.Fprintf(os.Stderr, "error in InsertAssignmentClass: %+v\n", err)
				ctx.Status(http.StatusInternalServerError)
				return
			}
		}

		ctx.Status(http.StatusOK)
	}
}
