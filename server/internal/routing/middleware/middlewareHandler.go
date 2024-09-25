package middleware

import "mathtestr.com/server/internal/routing/consts"

type MiddlewareHandler struct {
	JWTValidatedRoutes map[string]struct{}
}

func NewMiddlewareHandler() *MiddlewareHandler {
	MiddlewareHandler := MiddlewareHandler{
		JWTValidatedRoutes: map[string]struct{}{
			consts.RouteUrlValidateSession:   {},
			consts.RouteUrlSubmitGameSession: {},
			consts.RouteUrlGetGameSessions:   {},
			consts.RouteUrlGetStudents:       {},
		},
	}

	return &MiddlewareHandler
}
