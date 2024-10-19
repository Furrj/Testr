package middleware

import "mathtestr.com/server/internal/routing/consts"

type MiddlewareHandler struct {
	JWTValidatedRoutes map[string]struct{}
}

func NewMiddlewareHandler() *MiddlewareHandler {
	MiddlewareHandler := MiddlewareHandler{
		JWTValidatedRoutes: map[string]struct{}{
			consts.RouteUrlUserData:              {},
			consts.RouteUrlGameSessions:          {},
			consts.RouteUrlGetUserInfo:           {},
			consts.RouteUrlUpdateVertical:        {},
			consts.RouteUrlClasses:               {},
			consts.RouteUrlAddAssignment:         {},
			consts.RouteUrlGetAssignmentsTeacher: {},
			consts.RouteUrlStudent:               {},
			consts.RouteUrlGetPasswordResetCode:  {},
			consts.RouteUrlGetTeacherData:        {},
		},
	}

	return &MiddlewareHandler
}
