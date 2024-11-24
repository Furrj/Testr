package services

import (
	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/db"
	"github.com/Furrj/timestrainer/server/internal/services/cache"
	"github.com/Furrj/timestrainer/server/internal/services/env"
	"github.com/Furrj/timestrainer/server/internal/services/jwt"
	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
)

type Services struct {
	Log          *logrus.Logger
	SessionCache cache.Cache[api.UserId, *websocket.Conn]
	Query        *db.Queries
	Jwts         jwt.Jwts
	Env          env.EnvVars
}

func NewServices(log *logrus.Logger, q *db.Queries, e env.EnvVars) *Services {
	j := jwt.NewJwts(e)

	return &Services{
		Log:          log,
		SessionCache: cache.NewSessionCache[api.UserId, *websocket.Conn](),
		Query:        q,
		Jwts:         j,
		Env:          e,
	}
}
