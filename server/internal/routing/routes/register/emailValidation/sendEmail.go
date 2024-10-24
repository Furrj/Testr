package emailvalidation

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"mathtestr.com/server/internal/aws"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/types"
)

type reqSendEmail struct {
	Email string `json:"email"`
}

func SendEmail(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// get email param
		email := ctx.Query("email")
		if email == "" {
			ctx.Status(http.StatusBadRequest)
		}
		fmt.Println(email)

		// generate code
		code, err := uuid.NewRandom()
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
		}

		// create user
		userID, err := user.InsertUser(db)
		if err != nil {
			ctx.Status(http.StatusInternalServerError)
		}

		// insert registration information
		r := types.TeacherRegistration{
			Email:  email,
			UserID: userID,
			Code:   code,
		}
		if err := teacher.InsertTeacherRegistration(db, r); err != nil {
			ctx.Status(http.StatusOK)
		}

		// send email
		if err := aws.SendEmail(code); err != nil {
			ctx.Status(http.StatusInternalServerError)
		}

		ctx.Status(http.StatusOK)
	}
}
