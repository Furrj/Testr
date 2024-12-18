package cookies

import (
	"net/http"
	"time"
)

func CreateHTTPCookie(key CookieKey, content string, duration time.Duration) (http.Cookie, error) {
	cookie := http.Cookie{
		Name:     key,
		Value:    content,
		Path:     "",
		Expires:  time.Now().Add(duration),
		MaxAge:   int(duration.Seconds()),
		Secure:   true,
		HttpOnly: true,
		SameSite: http.SameSiteStrictMode,
	}

	if key == REFRESH_TOKEN_COOKIE_KEY {
		cookie.Path = "/api/user"
	}

	return cookie, nil
}
