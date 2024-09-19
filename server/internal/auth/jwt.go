package auth

import (
	"errors"
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"mathtestr.com/server/internal/types"
)

func CreateJWTFromUserID(userID types.UserID, expiryDays time.Duration) (string, error) {
	var (
		key []byte
		t   *jwt.Token
		s   string
		err error
	)

	expiryTime := time.Now().Add(time.Hour * 24 * expiryDays)

	key = []byte(os.Getenv("JWT_SECRET"))
	t = jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    "mathtestr.com",
		Subject:   strconv.FormatUint(uint64(userID), 10),
		ExpiresAt: &jwt.NumericDate{Time: expiryTime},
	})
	s, err = t.SignedString(key)
	if err != nil {
		return "", errors.New("error creating signed string")
	}

	return s, nil
}

func ParseAndValidateJWT(tokenString string, secretKey []byte) (*jwt.Token, error) {
	// Parse the token
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Make sure that the token's algorithm matches the expected algorithm
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secretKey, nil
	})
	if err != nil {
		return nil, err
	}

	// Validate the token
	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return token, nil
}
