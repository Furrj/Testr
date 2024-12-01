package jwt

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

func CreateFromClaims(t *jwt.Token, sec []byte) (Jwt, error) {
	s, err := t.SignedString(sec)
	if err != nil {
		return "", errors.New("error creating signed string")
	}

	return s, nil
}

func ParseToToken(j Jwt, cl jwt.Claims, sec []byte) (*jwt.Token, error) {
	// Parse the token
	token, err := jwt.ParseWithClaims(j, cl, func(token *jwt.Token) (interface{}, error) {
		// Make sure that the token's algorithm matches the expected algorithm
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(sec), nil
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
