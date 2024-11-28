package services

import (
	"github.com/Furrj/timestrainer/server/internal/db"
	"github.com/Furrj/timestrainer/server/internal/services/env"
	jwts "github.com/Furrj/timestrainer/server/internal/services/jwt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sirupsen/logrus"
)

type Services struct {
	Log   *logrus.Logger
	Query *db.Queries
	Jwts  jwts.JwtManager[*jwt.Token]
	Env   env.EnvVars
}

func NewServices(log *logrus.Logger, q *db.Queries, e env.EnvVars) *Services {
	j := jwts.NewJwtManager([]byte(e.JwtSecret))

	return &Services{
		Log:   log,
		Query: q,
		Jwts:  j,
		Env:   e,
	}
}
