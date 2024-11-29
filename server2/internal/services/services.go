package services

import (
	"github.com/Furrj/timestrainer/server/internal/db"
	"github.com/Furrj/timestrainer/server/internal/services/auth"
	"github.com/Furrj/timestrainer/server/internal/services/env"
	"github.com/sirupsen/logrus"
)

type Services struct {
	Log   *logrus.Logger
	Query *db.Queries
	Auth  auth.Auth
	Env   env.EnvVars
}

func NewServices(log *logrus.Logger, q *db.Queries, e env.EnvVars, au auth.Auth) *Services {
	return &Services{
		Log:   log,
		Query: q,
		Env:   e,
		Auth:  au,
	}
}
