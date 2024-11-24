package user

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/services"
	"github.com/Furrj/timestrainer/server/internal/services/cookies"
)

func GetUserInfoForClient(w http.ResponseWriter, r *http.Request, s *services.Services) {
	at, err := r.Cookie(cookies.ACCESS_TOKEN_COOKIE_KEY)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	j, err := s.Jwts.User.Parse(at.Value)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	// get user data
	user, err := s.Query.GetUserDataByUserId(context.Background(), int32(j.Id))
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	res := api.UserInfoForClient{
		FirstName: user.FirstName.String,
		LastName:  user.LastName.String,
		UserId:    int(user.UserID),
		Username:  user.Username.String,
	}
	b, err := json.Marshal(res)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}
