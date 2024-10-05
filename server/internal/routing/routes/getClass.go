package routes

import (
	"fmt"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/routing/utils"
)

func GetClass(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get userID from jwt
		userID, err := utils.GetJwtInfoFromCtx(ctx)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetJwtInfoFromCtx %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, nil)
			return
		}
		fmt.Printf("userID: %d\n", userID)

		// get userData
		userData, err := db.GetUserDataByUserID(userID)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, nil)
			fmt.Fprintf(os.Stderr, "error in GetUserDataByUserID: %+v\n", err)
			return
		}

		// validate role
		if userData.Role != "T" {
			ctx.JSON(http.StatusUnauthorized, nil)
			return
		}

		// get class id
		paramStr := ctx.Param("id")

		// Convert the string to a uint
		classParamID32, err := strconv.ParseUint(paramStr, 10, 32)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error parsing param string: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		classID := uint(classParamID32)

		// get class
		class, err := db.GetTeacherClassByClassID(classID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetTeacherClassByClassID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check user owns class
		if class.TeacherID != userID {
			ctx.Status(http.StatusUnauthorized)
			return
		}

		// get students
		students, err := db.GetStudentsDataByClassID(classID)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetStudentsDataByClassID: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.JSON(http.StatusOK, students)
	}
}
