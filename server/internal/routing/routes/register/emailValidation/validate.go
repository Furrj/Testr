package emailvalidation

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/types"
)

// TODO: put in envvar
const EXPIRY int = 3600

type reqValidateEmail struct {
	TeacherId types.UserID `json:"id"`
	Code      uuid.UUID    `json:"code"`
}

type resValidateEmail struct {
	TeacherId types.UserID `json:"teacher_id"`
	IsValid   bool         `json:"is_valid"`
}

func Validate(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		res := resValidateEmail{
			IsValid: false,
		}

		// bind request body
		var payload reqValidateEmail
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding json: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		fmt.Printf("%+v\n", payload)

		// get registration information
		r, err := teacher.GetTeacherRegistrationByTeacherId(db, payload.TeacherId)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetUnvalidatedTeacherRegistrationByUserId: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// check code equality
		if r.Code.String() != payload.Code.String() {
			ctx.JSON(http.StatusOK, res)
			return
		}

		// check for expiry
		if time.Now().Unix() > int64(r.IssuedAt+EXPIRY) {
			ctx.JSON(http.StatusOK, res)
			return
		}

		// update db
		if err := teacher.UpdateTeacherValidationStatusByTeacherId(db, payload.TeacherId, true); err != nil {
			fmt.Fprintf(os.Stderr, "error in UpdateTeacherValidationStatusByTeacherId: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// delete registration
		if err := teacher.DeleteTeacherRegistrationByTeacherId(db, payload.TeacherId); err != nil {
			fmt.Fprintf(os.Stderr, "error in DeleteTeacherRegistrationByTeacherId: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		res.IsValid = true
		res.TeacherId = r.TeacherID
		ctx.JSON(http.StatusOK, res)
	}
}
