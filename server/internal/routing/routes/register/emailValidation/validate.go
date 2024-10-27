package emailvalidation

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/types"
)

// TODO: put in envvar
const EXPIRY int = 3600

type reqValidateEmail struct {
	UserId types.UserID `json:"user_id"`
	Code   uuid.UUID    `json:"code"`
}

type resValidateEmail struct {
	IsValid bool `json:"is_valid"`
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

		// get validation code
		r, err := user.GetValidationCodeByUserId(db, payload.UserId)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error in GetValidationCodeByUserId: %+v\n", err)
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
		s := types.AccountStatus{
			UserId:      payload.UserId,
			IsActive:    false,
			IsValidated: true,
		}
		if err := user.UpdateAccountStatus(db, s); err != nil {
			fmt.Fprintf(os.Stderr, "error in UpdateValidationCode: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// delete validation code
		if err := user.DeleteValidationCodeByUserId(db, payload.UserId); err != nil {
			fmt.Fprintf(os.Stderr, "error in DeleteValidationCodeByUserId: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		res.IsValid = true
		ctx.JSON(http.StatusOK, res)
	}
}
