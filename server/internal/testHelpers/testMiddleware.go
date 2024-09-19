package testHelpers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/routing/consts"
	"mathtestr.com/server/internal/types"
)

type emptyStruct struct {
	A string
}

func TestMiddleware(tokens types.AllTokens, middleware gin.HandlerFunc) (*gin.Context, error) {
	gin.SetMode(gin.TestMode)
	w := httptest.NewRecorder()
	ctx, router := gin.CreateTestContext(w)

	marshalled, err := json.Marshal(emptyStruct{A: ""})
	if err != nil {
		return ctx, fmt.Errorf("error marshalling payload: %+vn", err)
	}

	r, err := http.NewRequest(http.MethodPost, consts.RouteUrlBase, bytes.NewReader(marshalled))
	if err != nil {
		return ctx, fmt.Errorf("error creating request: %+v", err)
	}
	r.Header.Set(consts.HeaderTypeAuthorization, fmt.Sprintf("%s%s", consts.BearerTokenPrefix, tokens.AccessToken))
	fmt.Printf("HEADER: %+v\n", r.Header.Get(consts.HeaderTypeAuthorization))
	router.Use(middleware)
	router.POST(consts.RouteUrlBase, func(c *gin.Context) {
		// This handler does nothing but ensures the middleware gets executed
		ctx = c
	})
	router.ServeHTTP(w, r)

	return ctx, nil
}
