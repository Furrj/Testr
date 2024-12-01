package user

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/ctx"
	"github.com/Furrj/timestrainer/server/internal/services"
)

func GetUserInfoForClient(w http.ResponseWriter, r *http.Request, s *services.Services) {
	ctx, err := ctx.GetProcessingCtx(r)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	// get user data
	user, err := s.Query.GetUserDataByUserId(context.Background(), int32(ctx.UserId))
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
		UserRole:  api.UserRole(user.Role),
	}
	b, err := json.Marshal(res)
	if err != nil {
		s.Log.Error(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(b)
}
