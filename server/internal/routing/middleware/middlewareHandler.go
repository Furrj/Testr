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
			consts.RouteUrlGetStudents:           {},
			consts.RouteUrlGetUserInfo:           {},
			consts.RouteUrlUpdateVertical:        {},
			consts.RouteUrlClasses:               {},
			consts.RouteUrlUpdateStudentClass:    {},
			consts.RouteUrlAddAssignment:         {},
			consts.RouteUrlGetAssignmentsTeacher: {},
			consts.RouteUrlStudent:               {},
			consts.RouteUrlGetPasswordResetCode:  {},
			consts.RouteUrlGetTeacherData:        {},
		},
	}

	return &MiddlewareHandler
}
