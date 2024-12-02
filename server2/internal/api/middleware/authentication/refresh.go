package authentication

import (
	"context"
	"net/http"
	"time"

	"github.com/Furrj/timestrainer/server/internal/api/middleware"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/ctx"
	"github.com/Furrj/timestrainer/server/internal/services/auth"
	"github.com/Furrj/timestrainer/server/internal/services/auth/tokens"
	"github.com/Furrj/timestrainer/server/internal/services/cookies"
	"github.com/sirupsen/logrus"
)

func Refresh(next http.Handler, w http.ResponseWriter, r *http.Request, log *logrus.Logger, ctx ctx.ProcessingCtx, auth auth.Auth) {
	// get cookie
	refTok, err := r.Cookie(cookies.REFRESH_TOKEN_COOKIE_KEY)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// parse
	rt, err := auth.Tokens.Refresh.Unmarshall(refTok.Value)
	if err != nil {
		log.Error(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// check expiry
	if rt.Expiry <= time.Now().Unix() {
		log.Error(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// set new access token
	at, err := auth.Tokens.Access.Create(tokens.AccessToken{
		UserId: rt.UserId,
	})
	ac, err := cookies.CreateHTTPCookie(cookies.ACCESS_TOKEN_COOKIE_KEY, at, auth.Tokens.Access.GetValidDuration())
	http.SetCookie(w, &ac)

	ctx.UserId = rt.UserId
	ctx.IsAuthenticated = true
	newCtx := context.WithValue(r.Context(), middleware.PROCESSING_CTX_KEY, ctx)
	next.ServeHTTP(w, r.WithContext(newCtx))
}
