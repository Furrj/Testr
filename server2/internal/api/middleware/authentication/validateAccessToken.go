package authentication

import (
	"context"
	"errors"
	"net/http"
	"time"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/api/middleware"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/ctx"
	"github.com/Furrj/timestrainer/server/internal/services/auth"
	"github.com/Furrj/timestrainer/server/internal/services/cookies"
	"github.com/sirupsen/logrus"
)

func ValidateAccessToken(log *logrus.Logger, auth auth.Auth) api.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// get ctx
			ctx, err := ctx.GetProcessingCtx(r)
			if err != nil {
				log.Error(err)
				w.WriteHeader(http.StatusBadRequest)
				return
			}

			// skip if no auth needed
			if ctx.Auth == middleware.AUTH_TYPE_NONE {
				next.ServeHTTP(w, r)
				return
			}

			// get AT cookie
			accTok, err := r.Cookie(cookies.ACCESS_TOKEN_COOKIE_KEY)
			if errors.Is(err, http.ErrNoCookie) {
				// run refTok mw if no accTok
				Refresh(next, w, r, log, ctx, auth)
			} else if err != nil {
				log.Error(err)
				w.WriteHeader(http.StatusUnauthorized)
				return
			}

			// parse
			at, err := auth.Tokens.Access.Unmarshall(accTok.Value)
			if err != nil {
				Refresh(next, w, r, log, ctx, auth)
			}

			// check expiry
			if at.Expiry <= time.Now().Unix() {
				Refresh(next, w, r, log, ctx, auth)
			}

			ctx.UserId = at.UserId
			ctx.IsAuthenticated = true
			newCtx := context.WithValue(r.Context(), middleware.PROCESSING_CTX_KEY, ctx)
			next.ServeHTTP(w, r.WithContext(newCtx))
		})
	}
}
