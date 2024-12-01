package auth

import (
	"github.com/Furrj/timestrainer/server/internal/services/auth/tokens"
	"github.com/Furrj/timestrainer/server/internal/services/cache"
)

type Auth struct {
	Tokens                   tokens.Tokens
	InvalidRefreshTokenCache cache.Cache[tokens.TokenId, any]
}
