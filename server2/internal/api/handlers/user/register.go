package user

import (
	"context"
	crypto "crypto/rand"
	"encoding/base64"
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/ctx"
	"github.com/Furrj/timestrainer/server/internal/api/serialization"
	"github.com/Furrj/timestrainer/server/internal/db"
	"github.com/Furrj/timestrainer/server/internal/services"
	"github.com/Furrj/timestrainer/server/internal/services/auth/tokens"
	"github.com/Furrj/timestrainer/server/internal/services/cookies"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
	"golang.org/x/crypto/bcrypt"
)

func UserRegister(w http.ResponseWriter, r *http.Request, s *services.Services) {
	// unmarshall body
	var req api.RegisterRequest
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

	// query for existing username
	cast := pgtype.Text{
		String: req.Username,
		Valid:  true,
	}
	_, err = s.Query.GetUserDataByUsername(context.Background(), cast)
	if err != nil && !errors.Is(err, pgx.ErrNoRows) {
		s.Log.Errorf("error in GetUserDataByUsername: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	} else if err == nil {
		// marshal res
		res := api.RegisterResponse{
			Valid: false,
		}
		bound, err := json.Marshal(res)
		if err != nil {
			s.Log.Error(err)
			w.WriteHeader(http.StatusInternalServerError)
			return

		}
		w.Write(bound)
		return
	}

	// salt and hash password
	salt, err := generateSalt(16)
	if err != nil {
		s.Log.Errorf("error generating salt: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(req.Password+salt), bcrypt.DefaultCost)
	if err != nil {
		s.Log.Errorf("error hashing pw: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// create user
	id, err := s.Query.CreateUser(context.Background())
	if err != nil {
		s.Log.Errorf("error in CreateUser: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// create and set access token
	at, err := s.Auth.Tokens.Access.Create(tokens.AccessToken{
		UserId: int(id),
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
		UserId: int(id),
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

	// create user data
	data := db.InsertUserDataParams{
		UserID: id,
		Username: pgtype.Text{
			String: req.Username,
			Valid:  true,
		},
		Password: pgtype.Text{
			String: string(hashed),
			Valid:  true,
		},
		Salt: pgtype.Text{
			String: salt,
			Valid:  true,
		},
		FirstName: pgtype.Text{
			String: req.FirstName,
			Valid:  true,
		},
		LastName: pgtype.Text{
			String: req.LastName,
			Valid:  true,
		},
		Role: "N",
		Vertical: pgtype.Bool{
			Bool:  false,
			Valid: true,
		},
	}

	// insert data
	_, err = s.Query.InsertUserData(context.Background(), data)
	if err != nil {
		s.Log.Errorf("error in InsertUserData: %+v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// marshal res
	res := api.RegisterResponse{
		Valid: true,
	}
	bound, err := json.Marshal(res)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return

	}
	w.Write(bound)
}

func generateSalt(size int) (string, error) {
	salt := make([]byte, size)
	_, err := io.ReadFull(crypto.Reader, salt)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(salt), nil
}
