package routes

import (
	crypto "crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
	"mathtestr.com/server/internal/auth"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"

	"github.com/gin-gonic/gin"
)

const (
	RESULT_NULL            int = -1
	RESULT_USERNAME_EXISTS int = 0
	RESULT_VALID           int = 1
)

type responseRegister struct {
	Tokens types.AllTokens `json:"tokens"`
	Result int             `json:"result"`
}

// Register recieves a RequestPayloadRegister, then checks if the username is valid,
// inserts into user_info, generates tokens, then sends a ResponseRegisterLogin
func Register(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var registerPayload types.RequestPayloadRegister
		response := responseRegister{
			Result: RESULT_NULL,
		}

		// bind request body
		if err := ctx.BindJSON(&registerPayload); err != nil {
			fmt.Printf("Error binding json: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, response)
			return
		}
		fmt.Printf("%+v\n", registerPayload)

		// verify role-related fields
		switch role := registerPayload.Role; role {
		case "S":
			if (registerPayload.TeacherID < 1) || (registerPayload.Period < 1) {
				fmt.Printf("invalid student fields: %+v\n", registerPayload)
				ctx.JSON(http.StatusBadRequest, response)
				return
			}

			// check if teacher valid
			_, err := db.GetTeacherDataByUserID(registerPayload.TeacherID)
			if err != nil {
				if err == pgx.ErrNoRows {
					fmt.Printf("invalid teacher id: %+v\n", registerPayload)
					ctx.JSON(http.StatusBadRequest, response)
					return
				}
			}
		case "T":
			if registerPayload.Periods < 1 {
				fmt.Printf("invalid teacher fields: %+v\n", registerPayload)
				ctx.JSON(http.StatusBadRequest, response)
				return
			}
		}

		// check if username currently exists
		_, err := db.GetUserIDByUsername(registerPayload.Username)
		if err != nil {
			if !errors.Is(err, pgx.ErrNoRows) {
				fmt.Printf("Error checking username validity: %+v\n", err)
				ctx.JSON(http.StatusInternalServerError, response)
				return
			}
		} else {
			fmt.Printf("Username '%s' already exists", registerPayload.Username)
			response.Result = RESULT_USERNAME_EXISTS
			ctx.JSON(http.StatusOK, response)
			return
		}

		// insert User
		userID, err := db.InsertUser()
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("Error inserting user: %+v\n", err)
			return
		}

		// salt and hash password
		salt, err := generateSalt(16)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error generating salt: %+v\n", err)
			return
		}

		hashed, err := bcrypt.GenerateFromPassword([]byte(registerPayload.Password+salt), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error hashing password: %+v\n", err)
			return
		}

		// create UserData
		UserData := types.UserData{
			UserID:    userID,
			Username:  registerPayload.Username,
			Password:  string(hashed),
			Salt:      salt,
			FirstName: registerPayload.FirstName,
			LastName:  registerPayload.LastName,
			Role:      registerPayload.Role,
			Vertical:  false,
		}

		// insert UserData
		if err := db.InsertUserData(UserData); err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error inserting user: %+v\n", err)
			return
		}

		// handle role-related
		switch role := registerPayload.Role; role {
		case "S":
			data := types.StudentData{
				UserID:    userID,
				TeacherID: registerPayload.TeacherID,
				Period:    registerPayload.Period,
			}
			if err := db.InsertStudentData(data); err != nil {
				ctx.JSON(http.StatusInternalServerError, response)
				fmt.Printf("error inserting student: %+v\n", err)
				return
			}
		case "T":
			data := types.TeacherData{
				UserID:  userID,
				Periods: registerPayload.Periods,
			}
			if err := db.InsertTeacherData(data); err != nil {
				ctx.JSON(http.StatusInternalServerError, response)
				fmt.Printf("error inserting student: %+v\n", err)
				return
			}
		}

		// generate JWT
		accessToken, err := auth.CreateJWTFromUserID(userID, 7)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			return
		}

		// set response
		response.Result = RESULT_VALID
		response.Tokens = types.AllTokens{
			AccessToken:  accessToken,
			RefreshToken: accessToken,
		}

		ctx.JSON(http.StatusCreated, response)

		// Backup
		//cmd := exec.Command("./backup.sh")
		//if err := cmd.Run(); err != nil {
		//	log.Printf("cError backing up Postgres: %+v\n", err)
		//}
	}
}

// generate a random salt of specified length
func generateSalt(size int) (string, error) {
	salt := make([]byte, size)
	_, err := io.ReadFull(crypto.Reader, salt)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(salt), nil
}
