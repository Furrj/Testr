package tokens

import (
	"strconv"
	"time"

	"github.com/Furrj/timestrainer/server/internal/api"
	jwts "github.com/Furrj/timestrainer/server/internal/services/jwt"
	"github.com/golang-jwt/jwt/v5"
)

type RefreshToken struct {
	Expiry uint64
	UserId api.UserId
}

type RefreshTokenManager struct {
	Issuer        string
	Secret        []byte
	ValidDuration time.Duration
}

func (rm RefreshTokenManager) Create(tok RefreshToken) (jwts.Jwt, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    rm.Issuer,
		Subject:   strconv.Itoa(tok.UserId),
		ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(rm.ValidDuration)},
	})

	jwt, err := jwts.CreateFromClaims(t, rm.Secret)
	if err != nil {
		return "", nil
	}

	return jwt, nil
}

func (rm RefreshTokenManager) Unmarshall(j jwts.Jwt) (RefreshToken, error) {
	t, err := jwts.ParseToClaims(j, rm.Secret)
	if err != nil {
		return RefreshToken{}, err
	}

	idStr, err := t.Claims.GetSubject()
	if err != nil {
		return RefreshToken{}, err
	}
	idCast, err := strconv.Atoi(idStr)
	if err != nil {
		return RefreshToken{}, err
	}

	exp, err := t.Claims.GetExpirationTime()
	if err != nil {
		return RefreshToken{}, err
	}

	return RefreshToken{
		UserId: idCast,
		Expiry: uint64(exp.Unix()),
	}, nil
}

func (rm RefreshTokenManager) GetValidDuration() time.Duration {
	return rm.ValidDuration
}
