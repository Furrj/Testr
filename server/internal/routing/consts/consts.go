package consts

const (
	CtxKeyUserid              string = "user_id"
	BearerTokenPrefix         string = "Bearer "
	HeaderTypeAuthorization   string = "Authorization"
	RouteUrlBase              string = "/api"
	RouteUrlLogin             string = RouteUrlBase + "/login"
	RouteUrlValidateSession   string = RouteUrlBase + "/validateSession"
	RouteUrlSubmitGameSession string = RouteUrlBase + "/submitGameSession"
	RouteUrlGetGameSessions   string = RouteUrlBase + "/getGameSessions"
	RouteUrlGetStudents       string = RouteUrlBase + "/getStudents"
	RouteUrlGetUserInfo       string = RouteUrlBase + "/getUserInfo/:id"
	RouteUrlUpdateVertical    string = RouteUrlBase + "/updateVertical"
	RouteUrlAddClasses        string = RouteUrlBase + "/classes/add"
	RouteUrlGetClasses        string = RouteUrlBase + "/classes/get"
	RouteUrlRegisterTeacher   string = RouteUrlBase + "/register/teacher"
	RouteUrlRegisterStudent   string = RouteUrlBase + "/register/student"
	RouteUrlCheckUsername     string = RouteUrlBase + "/checkUsername/:username"
	RouteUrlGetTeacherInfo    string = RouteUrlBase + "/getTeacherInfo/:id"
	RouteUrlGetClass          string = RouteUrlBase + "/class/:id"
)
