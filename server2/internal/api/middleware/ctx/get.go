package ctx

import (
	"errors"
	"net/http"

	"github.com/Furrj/timestrainer/server/internal/api/middleware"
)

func GetProcessingCtx(r *http.Request) (ProcessingCtx, error) {
	ctx := r.Context().Value(middleware.PROCESSING_CTX_KEY)

	v, ok := ctx.(ProcessingCtx)
	if !ok {
		return ProcessingCtx{}, errors.New("context object not found")
	}

	return v, nil
}
