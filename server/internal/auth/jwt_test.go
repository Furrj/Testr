package auth

import (
	"fmt"
	"os"
	"testing"

	"github.com/joho/godotenv"
)

func TestJWT(t *testing.T) {
	if err := godotenv.Load("../../../config/config.env"); err != nil {
		fmt.Printf("Error loading env vars: %+v\n", err)
		os.Exit(1)
	}

	t.Run("JWT creation test", func(t *testing.T) {
		jwt, err := CreateJWTFromUserID(1, 7)
		if err != nil {
			t.Errorf("Error creating JWT: %+v\n", err)
		}
		fmt.Println(jwt)
	})
}
