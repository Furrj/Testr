package log

import (
	"net/http"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/sirupsen/logrus"
)

func Log(log *logrus.Logger) api.MiddlewareFunc {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			log.Infof("%s %s", r.Method, r.URL.Path)
			next.ServeHTTP(w, r)
		})
	}
}
