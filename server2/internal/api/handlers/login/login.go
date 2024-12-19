package login

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/ctx"
	"github.com/Furrj/timestrainer/server/internal/api/serialization"
	"github.com/Furrj/timestrainer/server/internal/services"
	"github.com/Furrj/timestrainer/server/internal/services/auth/tokens"
	"github.com/Furrj/timestrainer/server/internal/services/cookies"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

func UserLogin(w http.ResponseWriter, r *http.Request, s *services.Services) {
	// unmarshall body
	var req api.LoginRequest
	if err := serialization.BindToStruct(r, &req); err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get ctx
	_, err := ctx.GetProcessingCtx(r)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// query for user data
	cast := pgtype.Text{}
	cast.Scan(req.Username)
	user, err := s.Query.GetUserDataByUsername(context.Background(), cast)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// check password
	var res api.LoginResponse
	bound, err := json.Marshal(res)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password.String), []byte(req.Password+user.Salt.String)); err != nil {
		w.Write(bound)
		return
	}

	// create and set access token
	at, err := s.Auth.Tokens.Access.Create(tokens.AccessToken{
		UserId: int(user.UserID),
	})
	if err != nil {
		s.Log.Errorf("error creating access token: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	ac, err := cookies.CreateHTTPCookie(cookies.ACCESS_TOKEN_COOKIE_KEY, at, s.Auth.Tokens.Access.GetValidDuration())
	if err != nil {
		s.Log.Errorf("error creating http cookie: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &ac)

	// create and set refresh token
	rt, err := s.Auth.Tokens.Refresh.Create(tokens.RefreshToken{
		UserId: int(user.UserID),
	})
	if err != nil {
		s.Log.Errorf("error creating refresh token: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	rc, err := cookies.CreateHTTPCookie(cookies.REFRESH_TOKEN_COOKIE_KEY, rt, s.Auth.Tokens.Refresh.GetValidDuration())
	if err != nil {
		s.Log.Errorf("error creating http cookie: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	http.SetCookie(w, &rc)

	res.Valid = true
	if err := serialization.SendStruct(w, res); err != nil {
		s.Log.Errorf("error in SendStruct: %+v\n", err)
	}
}
