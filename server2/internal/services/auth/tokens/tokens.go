package tokens

import "github.com/Furrj/timestrainer/server/internal/services/jwt"

type Tokens struct {
	Access  TokenManager[AccessToken, jwt.Jwt]
	Refresh TokenManager[RefreshToken, jwt.Jwt]
}

func NewTokensService(am TokenManager[AccessToken, jwt.Jwt], rm TokenManager[RefreshToken, jwt.Jwt]) Tokens {
	return Tokens{
		Access:  am,
		Refresh: rm,
	}
}
