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

type RefreshTokenClaims struct {
	jwt.RegisteredClaims
	Jti TokenId
}

// tok only needs UserId
func (rm RefreshTokenManager) Create(tok RefreshToken) (jwts.Jwt, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, RefreshTokenClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    rm.Issuer,
			Subject:   strconv.Itoa(tok.UserId),
			ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(rm.ValidDuration)},
		},
		Jti: uuid.New(),
	})

	jwt, err := jwts.CreateFromClaims(t, rm.Secret)
	if err != nil {
		return "", nil
	}

	return jwt, nil
}

func (rm RefreshTokenManager) Unmarshall(j jwts.Jwt) (RefreshToken, error) {
	t, err := jwts.ParseToToken(j, RefreshTokenClaims{}, rm.Secret)
	if err != nil {
		return RefreshToken{}, err
	}

	claims, ok := t.Claims.(*RefreshTokenClaims)
	if !ok {
		return RefreshToken{}, errors.New("token missing claims")
	}

	idCast, err := strconv.Atoi(claims.Subject)
	if err != nil {
		return RefreshToken{}, err
	}

	return RefreshToken{
		UserId:  idCast,
		Expiry:  claims.ExpiresAt.Unix(),
		TokenId: claims.Jti,
	}, nil
}

func (rm RefreshTokenManager) GetValidDuration() time.Duration {
	return rm.ValidDuration
}
