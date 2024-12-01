package handlers

import (
	"net/http"

	"github.com/Furrj/timestrainer/server/internal/api/handlers/login"
	"github.com/Furrj/timestrainer/server/internal/api/handlers/user"
	"github.com/Furrj/timestrainer/server/internal/services"
)

type RouteHandler struct {
	Services *services.Services
}

func NewRouteHandler(s *services.Services) RouteHandler {
	return RouteHandler{Services: s}
}

func (h RouteHandler) UserLogin(w http.ResponseWriter, r *http.Request) {
	login.UserLogin(w, r, h.Services)
}

func (h RouteHandler) UserRegister(w http.ResponseWriter, r *http.Request) {
	user.GetUserInfoForClient(w, r, h.Services)
}

func (h RouteHandler) GetUserInfoForClient(w http.ResponseWriter, r *http.Request) {
	user.GetUserInfoForClient(w, r, h.Services)
}
