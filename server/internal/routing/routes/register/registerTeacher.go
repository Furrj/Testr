package register

import (
	"errors"
	"fmt"
	"net/http"
	"os"

	ses "github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
	"mathtestr.com/server/internal/auth"
	"mathtestr.com/server/internal/aws"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/dbHandler/teacher"
	"mathtestr.com/server/internal/dbHandler/user"
	"mathtestr.com/server/internal/envvars"
	"mathtestr.com/server/internal/routing/utils"
	"mathtestr.com/server/internal/types"
)

const (
	RESULT_NULL            int = -1
	RESULT_USERNAME_EXISTS int = 0
	RESULT_EMAIL_EXISTS        = 1
	RESULT_VALID           int = 2
)

type reqRT struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}

type resRT struct {
	Tokens types.AllTokens `json:"tokens"`
	Result int             `json:"result"`
}

func RegisterTeacher(db *dbHandler.DBHandler, client *ses.Client, env envvars.EnvVars) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var payload reqRT
		res := resRT{
			Result: RESULT_NULL,
		}

		// bind request body
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Printf("Error binding json: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}
		fmt.Printf("%+v\n", payload)

		// check if username exists
		if _, err := user.GetUserIDByUsername(db, payload.Username); err == nil {
			fmt.Fprintf(os.Stderr, "username '%s' already exists", payload.Username)
			res.Result = RESULT_USERNAME_EXISTS
			ctx.JSON(http.StatusOK, res)
			return
		} else if !errors.Is(err, pgx.ErrNoRows) {
			fmt.Fprintf(os.Stderr, "error in GetUserIDByUsername: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		// check if email exists
		if _, err := teacher.GetTeacherDataByEmail(db, payload.Email); err == nil {
			fmt.Fprintf(os.Stderr, "email '%s' already exists", payload.Email)
			res.Result = RESULT_EMAIL_EXISTS
			ctx.JSON(http.StatusOK, res)
			return
		} else if !errors.Is(err, pgx.ErrNoRows) {
			fmt.Fprintf(os.Stderr, "error checking username validity: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		// create User
		userID, err := user.CreateUser(db)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error inserting user: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		// salt and hash password
		salt, err := utils.GenerateSalt(16)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error generating salt: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(payload.Password+salt), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, res)
			fmt.Fprintf(os.Stderr, "error hashing password: %+v\n", err)
			return
		}

		// create userData
		userData := types.UserData{
			UserID:    userID,
			Username:  payload.Username,
			Password:  string(hashed),
			Salt:      salt,
			FirstName: payload.FirstName,
			LastName:  payload.LastName,
			Role:      "T",
			Vertical:  false,
		}

		// create registration
		code, err := uuid.NewRandom()
		if err != nil {
			fmt.Fprintf(os.Stderr, "error creating uuid: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		reg := types.TeacherRegistration{
			TeacherID: userID,
			Code:      code,
		}

		// attempt send email
		if err := aws.SendEmail(client, env, reg, payload.Email); err != nil {
			fmt.Fprintf(os.Stderr, "error sending email to %s: %+v\n", payload.Email, err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		// insert UserData
		if err := user.InsertUserData(db, userData); err != nil {
			ctx.JSON(http.StatusInternalServerError, res)
			fmt.Printf("error inserting user: %+v\n", err)
			return
		}

		// insert TeacherData
		teacherData := types.TeacherData{
			Email:  payload.Email,
			UserID: userID,
		}
		if err := teacher.InsertTeacherData(db, teacherData); err != nil {
			fmt.Printf("error inserting teacher: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		// insert registration
		if err := teacher.InsertTeacherRegistration(db, reg); err != nil {
			fmt.Printf("error inserting teacher registration: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		// generate JWT
		accessToken, err := auth.CreateJWTFromUserID(userID, 7)
		if err != nil {
			fmt.Printf("error creating JWT: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		// set response
		res.Result = RESULT_VALID
		res.Tokens = types.AllTokens{
			AccessToken:  accessToken,
			RefreshToken: accessToken,
		}

		ctx.JSON(http.StatusCreated, res)
	}
}
