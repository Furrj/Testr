package ctx

import (
	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/api/middleware"
)

type ProcessingCtx struct {
	Auth            middleware.AuthType
	Type            middleware.RouteType
	UserId          api.UserId
	IsValidUrl      bool
	IsAuthenticated bool
	IsAuthorized    bool
}
