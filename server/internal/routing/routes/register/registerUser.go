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

type reqRU struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	Email     string `json:"email"`
}

type resRU struct {
	Tokens types.AllTokens `json:"tokens"`
	Result int             `json:"result"`
}

func RegisterUser(db *dbHandler.DBHandler, client *ses.Client, env envvars.EnvVars) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var payload reqRU
		res := resRU{
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
		if _, err := user.GetContactInfoByEmail(db, payload.Email); err == nil {
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

		// create validation code
		code, err := uuid.NewRandom()
		if err != nil {
			fmt.Fprintf(os.Stderr, "error creating uuid: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}
		val := types.ValidationCode{
			UserId: userID,
			Code:   code,
		}

		// attempt send email
		if err := aws.SendEmail(client, env, val.UserId, val.Code, payload.Email); err != nil {
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

		// insert validation code
		if err := user.InsertValidationCode(db, val); err != nil {
			fmt.Printf("error in InsertValidationCode: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		// create and insert auth status
		s := types.AccountStatus{
			UserId:         userID,
			IsActive:       false,
			MembershipType: 0,
		}
		if err := user.InsertAccountStatus(db, s); err != nil {
			fmt.Printf("error in InsertAccountStatus: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, res)
			return
		}

		// create and insert contact info
		ci := types.ContactInfo{
			Email:  payload.Email,
			Phone:  "",
			UserId: userID,
		}
		if err := user.InsertContactInfo(db, ci); err != nil {
			fmt.Printf("error in InsertContactInfo: %+v\n", err)
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
