package emailvalidation

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/types"
)

// TODO: put in envvar
const EXPIRY int = 3600

type reqVerifyEmail struct {
	Email string    `json:"email"`
	Code  uuid.UUID `json:"code"`
}

type resVerifyEmail struct {
	Data    types.TeacherRegistration `json:"data"`
	IsValid bool                      `json:"is_valid"`
}

func Verify(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		res := resVerifyEmail{
			IsValid: false,
		}

		// bind request body
		var payload reqVerifyEmail
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding json: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		fmt.Printf("%+v\n", payload)

		// get registration information
		r, err := teacher.GetUnvalidatedTeacherRegistrationByEmail(db, payload.Email)
		if err != nil {
			if err == pgx.ErrNoRows {
				ctx.JSON(http.StatusOK, res)
				return
			}
			fmt.Fprintf(os.Stderr, "error in GetTeacherRegistrationByUserId: %+v\n", err)
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
		r.IsValidated = true
		if err := teacher.UpdateTeacherRegistrationByEmail(db, r); err != nil {
			fmt.Fprintf(os.Stderr, "error in UpdateTeacherRegistrationByEmail: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		res.IsValid = true
		res.Data = r
		ctx.JSON(http.StatusOK, res)
	}
}
