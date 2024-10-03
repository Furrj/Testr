package routes

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
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
		userData, err := db.GetUserDataByUserID(userID)
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
		var payload types.ReqAddAssignment
		if err = ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding request body %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		fmt.Printf("payload: %+v\n", payload)

		// insert assignment
		id, err := generateNewAssignmentID(db)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in generateNewAssignmentID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		a := types.DBAssignment{
			Name:         payload.Name,
			AssignmentID: id,
			Min:          payload.Min,
			LimitType:    payload.LimitType,
			LimitAmount:  payload.LimitAmount,
			Due:          payload.Due,
			UserID:       userID,
			Max:          payload.Max,
			Add:          payload.Add,
			Sub:          payload.Sub,
			Mult:         payload.Mult,
			Div:          payload.Div,
			IsActive:     true,
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

func generateNewAssignmentID(db *dbHandler.DBHandler) (string, error) {
	for {
		// generate a new UUID
		id := uuid.New().String()

		// check if id exists
		_, err := db.GetAssignmentDataByAssignmentID(id)
		if err != nil {
			if err == pgx.ErrNoRows {
				return id, nil
			}
			return id, err
		}
	}
}
