package cookies

import (
	"net/http"
	"time"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/services/jwt"
)

func CreateHTTPCookie(key CookieKey, id api.UserId, j jwt.Jwts, secure bool) (http.Cookie, error) {
	token, err := j.User.Create(jwt.JwtFieldsUser{
		Id: id,
	})
	if err != nil {
		return http.Cookie{}, err
	}

	expiry := time.Hour * 24 * 7

	cookie := http.Cookie{
		Name:     key,
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(expiry),
		MaxAge:   int(expiry.Seconds()),
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteNoneMode,
	}

	if secure {
		cookie.Secure = true
		cookie.SameSite = http.SameSiteStrictMode
	}

	return cookie, nil
}
