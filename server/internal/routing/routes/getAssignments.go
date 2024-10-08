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

func GetAssignmentsTeacher(db *dbHandler.DBHandler) gin.HandlerFunc {
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

		res := []types.Assignment{}

		// get assignments
		a, err := db.GetAllAssignmentsByTeacherID(userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetAllAssignmentsDataByUserID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		for _, v := range a {
			r := types.Assignment{
				Classes: []uint{},
			}
			// get classes for assignment
			classes, err := db.GetAllAssignmentClassesByAssignmentID(v.AssignmentID)
			if err != nil {
				fmt.Fprintf(os.Stderr, "error in GetTeacherClassesByUserID: %+v\n", err)
				ctx.Status(http.StatusInternalServerError)
			}
			r.Classes = classes

			res = append(res, r)
		}

		ctx.JSON(http.StatusOK, res)
	}
}
