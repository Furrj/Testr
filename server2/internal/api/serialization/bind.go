package serialization

import (
	"encoding/json"
	"io"
	"net/http"
)

func BindToStruct[T any](r *http.Request, t *T) error {
	buf, err := io.ReadAll(r.Body)
	if err != nil {
		return err
	}
	defer r.Body.Close()

	if err := json.Unmarshal(buf, t); err != nil {
		return err
	}

	return nil
}
