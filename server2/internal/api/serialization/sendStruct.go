package serialization

import (
	"encoding/json"
	"net/http"
)

func SendStruct[T any](w http.ResponseWriter, st T) error {
	bound, err := json.Marshal(st)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return err
	}

	w.Header().Set("Content-Type", "application/json")
	if _, err := w.Write(bound); err != nil {
		return err
	}

	return nil
}
