package classify

import (
	"context"
	"net/http"
	"strings"

	"github.com/Furrj/timestrainer/server/internal/api/middleware"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/ctx"
)

func Classify(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		parts := strings.Split(r.URL.Path, "/")
		route, exists := ctxMap[parts[2]]
		if exists {
			route.IsValidUrl = true
		}

		ctx := context.WithValue(r.Context(), middleware.PROCESSING_CTX_KEY, route)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

var ctxMap = map[string]ctx.ProcessingCtx{
	middleware.ROUTE_URL_LOGIN: {
		Auth: middleware.AUTH_TYPE_NONE,
		Type: middleware.ROUTE_TYPE_LOGIN,
	},
	middleware.ROUTE_URL_REGISTER: {
		Auth: middleware.AUTH_TYPE_NONE,
		Type: middleware.ROUTE_TYPE_REGISTER,
	},
	middleware.ROUTER_URL_USER: {
		Auth: middleware.AUTH_TYPE_ACCESS_TOKEN,
	},
}
