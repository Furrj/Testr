package tokens

import (
	"errors"
	"strconv"
	"time"

	"github.com/Furrj/timestrainer/server/internal/api"
	jwts "github.com/Furrj/timestrainer/server/internal/services/jwt"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type TokenId = uuid.UUID

type RefreshToken struct {
	TokenId TokenId
	UserId  api.UserId
	Expiry  int64
}

type RefreshTokenManager struct {
	Issuer        string
	Secret        []byte
	ValidDuration time.Duration
}

// tok only needs UserId
func (rm RefreshTokenManager) Create(tok RefreshToken) (jwts.Jwt, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    rm.Issuer,
		Subject:   strconv.Itoa(tok.UserId),
		Audience:  []string{"core"},
		ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(rm.ValidDuration)},
		NotBefore: &jwt.NumericDate{Time: time.Now()},
		IssuedAt:  &jwt.NumericDate{Time: time.Now()},
		ID:        uuid.NewString(),
	})

	jwt, err := jwts.CreateFromClaims(t, rm.Secret)
	if err != nil {
		return "", nil
	}

	return jwt, nil
}

func (rm RefreshTokenManager) Unmarshall(j jwts.Jwt) (RefreshToken, error) {
	t, err := jwts.ParseToToken(j, &jwt.RegisteredClaims{}, rm.Secret)
	if err != nil {
		return RefreshToken{}, err
	}

	claims, ok := t.Claims.(*jwt.RegisteredClaims)
	if !ok {
		return RefreshToken{}, errors.New("invalid decoded claims")
	}

	userId, err := strconv.Atoi(claims.Subject)
	if err != nil {
		return RefreshToken{}, err
	}

	tokenIdS := claims.ID
	tokenIdU, err := uuid.Parse(tokenIdS)
	if err != nil {
		return RefreshToken{}, err
	}

	return RefreshToken{
		UserId:  userId,
		Expiry:  claims.ExpiresAt.Unix(),
		TokenId: tokenIdU,
	}, nil
}

func (rm RefreshTokenManager) GetValidDuration() time.Duration {
	return rm.ValidDuration
}
