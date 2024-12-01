package tokens

import (
	"errors"
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

// tok only needs UserId
func (am AccessTokenManager) Create(tok AccessToken) (jwts.Jwt, error) {
	t := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.RegisteredClaims{
		Issuer:    am.Issuer,
		Subject:   strconv.Itoa(tok.UserId),
		Audience:  []string{"core"},
		ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(am.ValidDuration)},
		NotBefore: &jwt.NumericDate{Time: time.Now()},
		IssuedAt:  &jwt.NumericDate{Time: time.Now()},
		ID:        "test",
	})

	jwt, err := jwts.CreateFromClaims(t, am.Secret)
	if err != nil {
		return "", nil
	}

	return jwt, nil
}

func (am AccessTokenManager) Unmarshall(j jwts.Jwt) (AccessToken, error) {
	t, err := jwts.ParseToToken(j, &jwt.RegisteredClaims{}, am.Secret)
	if err != nil {
		return AccessToken{}, err
	}

	claims, ok := t.Claims.(*jwt.RegisteredClaims)
	if !ok {
		return AccessToken{}, errors.New("invalid decoded claims")
	}

	idStr := claims.Subject
	idUint, err := strconv.Atoi(idStr)
	if err != nil {
		return AccessToken{}, err
	}

	return AccessToken{
		UserId: idUint,
		Expiry: uint64(claims.ExpiresAt.Unix()),
	}, nil
}

func (am AccessTokenManager) GetValidDuration() time.Duration {
	return am.ValidDuration
}
