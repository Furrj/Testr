package authentication

import (
	"context"
	"net/http"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/api/middleware"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/ctx"
	"github.com/Furrj/timestrainer/server/internal/services/auth"
	"github.com/Furrj/timestrainer/server/internal/services/cookies"
	"github.com/sirupsen/logrus"
)

func HandleAccessToken(log *logrus.Logger, auth auth.Auth) api.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ctx, err := ctx.GetProcessingCtx(r)
			if err != nil {
				log.Error(err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			if ctx.Auth == middleware.AUTH_TYPE_NONE {
				next.ServeHTTP(w, r)
				return
			}

			cookie, err := r.Cookie(cookies.ACCESS_TOKEN_COOKIE_KEY)
			if err != nil {
				log.Error(err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			at, err := auth.Tokens.Access.Unmarshall(cookie.Value)
			if err != nil {
				log.Error(err)
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			ctx.UserId = at.UserId
			ctx.IsAuthenticated = true

			newCtx := context.WithValue(r.Context(), middleware.PROCESSING_CTX_KEY, ctx)
			next.ServeHTTP(w, r.WithContext(newCtx))
		})
	}
}
