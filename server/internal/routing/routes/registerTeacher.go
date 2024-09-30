package routes

import (
	crypto "crypto/rand"
	"encoding/base64"
	"errors"
	"fmt"
	"io"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
	"mathtestr.com/server/internal/auth"
	"mathtestr.com/server/internal/dbHandler"
	"mathtestr.com/server/internal/types"
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

type ReqRT struct {
	Username  string `json:"username"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
	School    string `json:"school"`
	Email     string `json:"email"`
}

func RegisterTeacher(db *dbHandler.DBHandler) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var payload ReqRT
		response := responseRegister{
			Result: RESULT_NULL,
		}

		// bind request body
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Printf("Error binding json: %+v\n", err)
			ctx.JSON(http.StatusInternalServerError, response)
			return
		}
		fmt.Printf("%+v\n", payload)

		// check if username currently exists
		_, err := db.GetUserIDByUsername(payload.Username)
		if err != nil {
			if !errors.Is(err, pgx.ErrNoRows) {
				fmt.Printf("Error checking username validity: %+v\n", err)
				ctx.JSON(http.StatusInternalServerError, response)
				return
			}
		} else {
			fmt.Printf("Username '%s' already exists", payload.Username)
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

		hashed, err := bcrypt.GenerateFromPassword([]byte(payload.Password+salt), bcrypt.DefaultCost)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error hashing password: %+v\n", err)
			return
		}

		// create UserData
		UserData := types.UserData{
			UserID:    userID,
			Username:  payload.Username,
			Password:  string(hashed),
			Salt:      salt,
			FirstName: payload.FirstName,
			LastName:  payload.LastName,
			Role:      "T",
			Vertical:  false,
		}

		// insert UserData
		if err := db.InsertUserData(UserData); err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error inserting user: %+v\n", err)
			return
		}

		// insert TeacherData
		teacherData := types.TeacherData{
			Email:  payload.Email,
			School: payload.School,
			UserID: userID,
		}
		if err := db.InsertTeacherData(teacherData); err != nil {
			ctx.JSON(http.StatusInternalServerError, response)
			fmt.Printf("error inserting teacher: %+v\n", err)
			return
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
