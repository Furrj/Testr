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
	"mathtestr.com/server/internal/aws"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/envvars"
	"mathtestr.com/server/internal/types"
)

type reqSubmitEmail struct {
	Email string `json:"email"`
}

type resSubmitEmail struct {
	IsSent        bool `json:"is_sent"`
	AlreadyExists bool `json:"already_exists"`
}

func Submit(db *dbHandler.DBHandler, client *ses.Client, env envvars.EnvVars) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var res resSubmitEmail

		// bind request body
		var payload reqSubmitEmail
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding json: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		// check if email aready exists
		if _, err := teacher.GetTeacherDataByEmail(db, payload.Email); err == nil {
			res.AlreadyExists = true
			ctx.JSON(http.StatusOK, res)
			return
		} else if err != pgx.ErrNoRows {
			fmt.Fprintf(os.Stderr, "error in GetTeacherDataByEmail: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		// check if code already exists for email
		if r, err := teacher.GetTeacherRegistrationByEmail(db, payload.Email); err == nil {
			now := int(time.Now().Unix())

			if now > r.IssuedAt+EXPIRY { // if expired
				code, err := uuid.NewRandom()
				if err != nil {
					fmt.Fprintf(os.Stderr, "error creating uuid: %+v\n", err)
					ctx.Status(http.StatusInternalServerError)
					return
				}

				r.Code = code

				// attempt send email
				if err := aws.SendEmail(client, env, r); err != nil {
					fmt.Fprintf(os.Stderr, "error sending email to %s: %+v\n", r.Email, err)
					ctx.Status(http.StatusInternalServerError)
					return
				}
				res.IsSent = true

				// update db
				r.IssuedAt = now
				if err := teacher.UpdateTeacherRegistrationByEmail(db, r); err != nil {
					fmt.Fprintf(os.Stderr, "error in UpdateTeacherRegistrationByEmail: %+v\n", err)
					ctx.Status(http.StatusInternalServerError)
					return
				}

				ctx.JSON(http.StatusOK, res)
				return
			} else { // if not expired
				// attempt send email
				if err := aws.SendEmail(client, env, r); err != nil {
					fmt.Fprintf(os.Stderr, "error sending email to %s: %+v\n", r.Email, err)
					ctx.Status(http.StatusInternalServerError)
					return
				}
				res.IsSent = true

				ctx.JSON(http.StatusOK, res)
			}
		} else if err != pgx.ErrNoRows {
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// generate code
		code, err := uuid.NewRandom()
		if err != nil {
			fmt.Fprintf(os.Stderr, "error creating uuid: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		r := types.TeacherRegistration{
			Email:       payload.Email,
			Code:        code,
			IsValidated: false,
		}

		// attempt send email
		if err := aws.SendEmail(client, env, r); err != nil {
			fmt.Fprintf(os.Stderr, "error sending email to %s: %+v\n", r.Email, err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		res.IsSent = true

		// insert registration information
		if err := teacher.InsertTeacherRegistration(db, r); err != nil {
			fmt.Fprintf(os.Stderr, "error in InsertTeacherRegistration: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		ctx.JSON(http.StatusOK, res)
	}
}
