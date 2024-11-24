package ctx

import "github.com/Furrj/timestrainer/server/internal/api/middleware"

type ProcessingCtx struct {
	Auth            middleware.AuthType
	Type            middleware.RouteType
	IsValidUrl      bool
	isAuthenticated bool
	isAuthorized    bool
}
