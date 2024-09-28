package consts

const (
	CtxKeyUserid              string = "user_id"
	BearerTokenPrefix         string = "Bearer "
	HeaderTypeAuthorization   string = "Authorization"
	RouteUrlBase              string = "/api"
	RouteUrlLogin             string = RouteUrlBase + "/login"
	RouteUrlRegister          string = RouteUrlBase + "/register"
	RouteUrlValidateSession   string = RouteUrlBase + "/validateSession"
	RouteUrlSubmitGameSession string = RouteUrlBase + "/submitGameSession"
	RouteUrlGetGameSessions   string = RouteUrlBase + "/getGameSessions"
	RouteUrlGetStudents       string = RouteUrlBase + "/getStudents"
	RouteUrlGetUserInfo       string = RouteUrlBase + "/getUserInfo/:id"
	RouteUrlUpdateVertical    string = RouteUrlBase + "/updateVertical"
	RouteUrlAddClass          string = RouteUrlBase + "/classes/add"
)
