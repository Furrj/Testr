package emailvalidation

import (
	"fmt"
	"net/http"
	"os"
	"time"

	ses "github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/types"
)

type reqSendEmail struct {
	Email string `json:"email"`
}

func Send(db *dbHandler.DBHandler, client *ses.Client) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// bind request body
		var payload reqSendEmail
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding json: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		fmt.Printf("%+v\n", payload)

		// check if code already exists for email
		exists := true
		r, err := teacher.GetTeacherRegistrationByEmail(db, payload.Email)
		if err != nil {
			if err == pgx.ErrNoRows {
				exists = false
			} else {
				ctx.Status(http.StatusInternalServerError)
				return
			}
		}

		if exists {
			// check expiry
			now := int(time.Now().Unix())
			if now > r.Expiry {
				code, err := uuid.NewRandom()
				if err != nil {
					fmt.Fprintf(os.Stderr, "error creating uuid: %+v\n", err)
					ctx.Status(http.StatusInternalServerError)
					return
				}

				r.Code = code

				r.Expiry = now + 60*60

				if err := teacher.UpdateTeacherRegistrationByEmail(db, r); err != nil {
					fmt.Fprintf(os.Stderr, "error in UpdateTeacherRegistrationByEmail: %+v\n", err)
					ctx.Status(http.StatusInternalServerError)
					return
				}
			}
		} else {
			// generate code
			code, err := uuid.NewRandom()
			if err != nil {
				fmt.Fprintf(os.Stderr, "error creating uuid: %+v\n", err)
				ctx.Status(http.StatusInternalServerError)
				return
			}

			// create user
			userId, err := user.InsertUser(db)
			if err != nil {
				fmt.Fprintf(os.Stderr, "error in InsertUser: %+v\n", err)
				ctx.Status(http.StatusInternalServerError)
				return
			}

			r = types.TeacherRegistration{
				Email:  payload.Email,
				UserID: userId,
				Code:   code,
			}

			// insert registration information
			if err := teacher.InsertTeacherRegistration(db, r); err != nil {
				fmt.Fprintf(os.Stderr, "error in InsertTeacherRegistration: %+v\n", err)
				ctx.Status(http.StatusInternalServerError)
				return
			}
		}

		// // send email
		// if err := aws.SendEmail(client, r); err != nil {
		// 	fmt.Fprintf(os.Stderr, "error in SendEmail: %+v\n", err)
		// 	ctx.Status(http.StatusInternalServerError)
		// 	return
		// }

		fmt.Printf("%+v\n", r)

		ctx.Status(http.StatusOK)
	}
}
