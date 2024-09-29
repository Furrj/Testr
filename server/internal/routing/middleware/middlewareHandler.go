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
			consts.RouteUrlGetUserInfo:       {},
			consts.RouteUrlUpdateVertical:    {},
			consts.RouteUrlAddClass:          {},
			consts.RouteUrlGetClasses:        {},
			consts.RouteUrlRegisterTeacher:   {},
			consts.RouteUrlRegisterStudent:   {},
		},
	}

	return &MiddlewareHandler
}
