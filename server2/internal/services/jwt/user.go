package jwt

import (
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/services/env"
	"github.com/golang-jwt/jwt/v5"
)

const (
	expiryDays = 5
	issuerUrl  = "timestrainer.com"
)

type user struct {
	env env.EnvVars
}

func newUser(env env.EnvVars) user {
	return user{env: env}
}

func (u user) Create(j JwtFieldsUser) (api.Jwt, error) {
	var (
		key []byte
		t   *jwt.Token
		s   string
		err error
	)

	expiryTime := time.Now().Add(time.Hour * 24 * expiryDays)

	key = []byte(u.env.JwtSecret)
	t = jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    issuerUrl,
		Subject:   strconv.Itoa(j.Id),
		ExpiresAt: &jwt.NumericDate{Time: expiryTime},
	})
	s, err = t.SignedString(key)
	if err != nil {
		return "", errors.New("error creating signed string")
	}

	return s, nil
}

func (u user) Parse(j api.Jwt) (JwtFieldsUser, error) {
	f := JwtFieldsUser{}

	// Parse the token
	token, err := jwt.Parse(j, func(token *jwt.Token) (interface{}, error) {
		// Make sure that the token's algorithm matches the expected algorithm
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(u.env.JwtSecret), nil
	})
	if err != nil {
		return f, err
	}

	// Validate the token
	if !token.Valid {
		return f, fmt.Errorf("invalid token")
	}

	// claims, ok := token.Claims.(jwt.RegisteredClaims)
	// if !ok {
	// 	return f, fmt.Errorf("invalid claims")
	// }

	rawId, err := token.Claims.GetSubject()
	if err != nil {
		return JwtFieldsUser{}, err
	}

	rawExp, err := token.Claims.GetExpirationTime()
	if err != nil {
		return JwtFieldsUser{}, err
	}

	castId, err := strconv.Atoi(rawId)
	if err != nil {
		return f, err
	}

	f = JwtFieldsUser{
		Id:     castId,
		Expiry: rawExp.Unix(),
	}

	return f, nil
}

var u JwtManager[JwtFieldsUser] = user{}

type JwtFieldsUser struct {
	Id     api.UserId
	Expiry timestamp
}
