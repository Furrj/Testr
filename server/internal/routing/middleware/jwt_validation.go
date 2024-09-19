package middleware

import (
	"errors"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"mathtestr.com/server/internal/auth"
	"mathtestr.com/server/internal/routing/consts"
)

type invalidResponse struct {
	Valid bool `json:"valid"`
}

func (mw *MiddlewareHandler) ValidateAccessToken() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		invalidResponse := invalidResponse{
			Valid: false,
		}

		if _, exists := mw.JWTValidatedRoutes[ctx.FullPath()]; !exists {
			fmt.Println("Skipping middleware")
			ctx.Next()
			return
		}

		authHeader := ctx.GetHeader(consts.HeaderTypeAuthorization)
		fmt.Println(authHeader)
		if !strings.HasPrefix(authHeader, consts.BearerTokenPrefix) {
			fmt.Println("No bearer token")
			ctx.JSON(http.StatusUnauthorized, invalidResponse)
			ctx.Abort()
			return
		}
		jwtString := trimTokenPrefix(consts.BearerTokenPrefix, authHeader)

		token, err := auth.ParseAndValidateJWT(jwtString, []byte(os.Getenv("JWT_SECRET")))
		if err != nil {
			if errors.Is(err, jwt.ErrTokenMalformed) {
				fmt.Printf("%+v\n", err)
			} else {
				fmt.Printf("Error parsing token: %+v\n", err)
			}
			ctx.JSON(http.StatusUnauthorized, invalidResponse)
			ctx.Abort()
			return
		}

		userIdAsString, err := token.Claims.GetSubject()
		if err != nil {
			fmt.Printf("Error getting subject claim from token: %+v\n", err)
			ctx.JSON(http.StatusUnauthorized, invalidResponse)
			ctx.Abort()
			return
		}
		fmt.Printf("SUB: %+v\n", userIdAsString)
		expiry, err := token.Claims.GetExpirationTime()
		if err != nil {
			fmt.Printf("error getting expiry: %+v\n", err)
		} else {
			fmt.Printf("EXPIRY: %+v\n", expiry.Time)
		}

		userID, err := stringToUint(userIdAsString)
		if err != nil {
			fmt.Println("Error parsing userID to uint")
			ctx.JSON(http.StatusUnauthorized, invalidResponse)
			ctx.Abort()
			return
		}

		fmt.Println("ValidateJWTMiddleware success")
		ctx.Set(consts.CtxKeyUserid, userID)
		ctx.Next()
	}
}

func trimTokenPrefix(prefix, authHeader string) string {
	return strings.TrimSpace(strings.TrimPrefix(authHeader, prefix))
}

func stringToUint(s string) (uint, error) {
	// Convert the string to an unsigned 64-bit integer
	u64, err := strconv.ParseUint(s, 10, 0)
	if err != nil {
		return 0, err
	}
	// Convert the unsigned 64-bit integer to a uint
	return uint(u64), nil
}
