package jwt

import (
	"errors"
	"fmt"

	"github.com/golang-jwt/jwt/v5"
)

type JwtManager[T any] interface {
	Create(T) (Jwt, error)
	Parse(Jwt) (T, error)
}

type (
	Jwts struct {
		Secret []byte
	}
	Jwt       = string
	timestamp = int64
)

func (jm Jwts) Create(t *jwt.Token) (Jwt, error) {
	s, err := t.SignedString(jm.Secret)
	if err != nil {
		return "", errors.New("error creating signed string")
	}

	return s, nil
}

func (jm Jwts) Parse(j Jwt) (*jwt.Token, error) {
	// Parse the token
	token, err := jwt.Parse(j, func(token *jwt.Token) (interface{}, error) {
		// Make sure that the token's algorithm matches the expected algorithm
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(jm.Secret), nil
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

func NewJwtManager(secret []byte) JwtManager[*jwt.Token] {
	return Jwts{Secret: secret}
}
