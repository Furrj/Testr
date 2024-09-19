package consts

const (
	CtxKeyUserid            string = "user_id"
	BearerTokenPrefix       string = "Bearer "
	HeaderTypeAuthorization string = "Authorization"
	RouteUrlBase            string = "/api"
	RouteUrlLogin           string = RouteUrlBase + "/login"
	RouteUrlRegister        string = RouteUrlBase + "/register"
	RouteUrlValidateSession string = RouteUrlBase + "/validateSession"
)
