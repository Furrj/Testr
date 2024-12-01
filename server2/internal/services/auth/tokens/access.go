package tokens

import (
	"strconv"
	"time"

	"github.com/Furrj/timestrainer/server/internal/api"
	jwts "github.com/Furrj/timestrainer/server/internal/services/jwt"
	"github.com/golang-jwt/jwt/v5"
)

type AccessToken struct {
	UserId api.UserId
	Expiry uint64
}

type AccessTokenManager struct {
	Issuer        string
	Secret        []byte
	ValidDuration time.Duration
}

func (am AccessTokenManager) Create(tok AccessToken) (jwts.Jwt, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    am.Issuer,
		Subject:   strconv.Itoa(tok.UserId),
		ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(am.ValidDuration)},
	})

	jwt, err := jwts.CreateFromClaims(t, am.Secret)
	if err != nil {
		return "", nil
	}

	return jwt, nil
}

func (am AccessTokenManager) Unmarshall(j jwts.Jwt) (AccessToken, error) {
	t, err := jwts.ParseToToken(j, jwt.RegisteredClaims{}, am.Secret)
	if err != nil {
		return AccessToken{}, err
	}

	idStr, err := t.Claims.GetSubject()
	if err != nil {
		return AccessToken{}, err
	}
	idUint, err := strconv.Atoi(idStr)
	if err != nil {
		return AccessToken{}, err
	}

	exp, err := t.Claims.GetExpirationTime()
	if err != nil {
		return AccessToken{}, err
	}

	return AccessToken{
		UserId: idUint,
		Expiry: uint64(exp.Unix()),
	}, nil
}

func (am AccessTokenManager) GetValidDuration() time.Duration {
	return am.ValidDuration
}
