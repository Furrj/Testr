package jwt

import (
	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/services/env"
)

type JwtManager[T any] interface {
	Create(T) (api.Jwt, error)
	Parse(api.Jwt) (T, error)
}

type Jwts struct {
	User JwtManager[JwtFieldsUser]
}

func NewJwts(env env.EnvVars) Jwts {
	return Jwts{User: newUser(env)}
}

type timestamp = int64
