package middleware

const (
	PROCESSING_CTX_KEY string = "ROUTE_CTX"

	AUTH_TYPE_NONE         AuthType = "AUTH_TYPE_NONE"
	AUTH_TYPE_ACCESS_TOKEN AuthType = "AUTH_TYPE_ACCESS_TOKEN"

	ROUTE_TYPE_KEY               RouteType = "ROUTE_TYPE_KEY"
	ROUTE_TYPE_LOGIN             RouteType = "ROUTE_TYPE_LOGIN"
	ROUTE_TYPE_REGISTER          RouteType = "ROUTE_TYPE_REGISTER"
	ROUTE_TYPE_REQUEST_RESOURCES RouteType = "ROUTE_TYPE_REQUEST_RESOURCES"

	ROUTE_URL_LOGIN    RouteUrl = "login"
	ROUTE_URL_REGISTER RouteUrl = "register"
	ROUTER_URL_USER    RouteUrl = "user"
)

type (
	RouteType = string
	RouteUrl  = string
	AuthType  = string
)
