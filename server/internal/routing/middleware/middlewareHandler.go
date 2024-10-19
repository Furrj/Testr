package middleware

import "mathtestr.com/server/internal/routing/consts"

type MiddlewareHandler struct {
	JWTValidatedRoutes map[string]struct{}
}

func NewMiddlewareHandler() *MiddlewareHandler {
	MiddlewareHandler := MiddlewareHandler{
		JWTValidatedRoutes: map[string]struct{}{
			consts.RouteUrlGetUserData:           {},
			consts.RouteUrlSubmitGameSession:     {},
			consts.RouteUrlGetGameSessions:       {},
			consts.RouteUrlGetStudents:           {},
			consts.RouteUrlGetUserInfo:           {},
			consts.RouteUrlUpdateVertical:        {},
			consts.RouteUrlAddClass:              {},
			consts.RouteUrlGetClasses:            {},
			consts.RouteUrlGetClass:              {},
			consts.RouteUrlGetStudentData:        {},
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
