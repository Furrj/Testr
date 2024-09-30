package routes

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
)

type resGetTeacherInfo struct {
	FirstName string               `json:"first_name"`
	LastName  string               `json:"last_name"`
	School    string               `json:"school"`
	Classes   []types.TeacherClass `json:"classes"`
}

func GetTeacherInfo(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get param
		paramStr := ctx.Param("id")

		// convert the string to a uint
		userParamID32, err := strconv.ParseUint(paramStr, 10, 32)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error parsing param string: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		userID := types.UserID(userParamID32)

		// get user data
		userData, err := db.GetUserDataByUserID(userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		// get teacher data
		teacherData, err := db.GetTeacherDataByUserID(userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetTeacherDataByUserID: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		// get classes
		classes, err := db.GetTeacherClassesByUserID(userID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetTeacherClassesByUserID: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		res := resGetTeacherInfo{
			FirstName: userData.FirstName,
			LastName:  userData.LastName,
			School:    teacherData.School,
			Classes:   classes,
		}
		ctx.JSON(http.StatusOK, res)
	}
}
