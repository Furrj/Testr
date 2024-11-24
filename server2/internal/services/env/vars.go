package env

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

func FetchEnvVars(filepath string, log *logrus.Logger) EnvVars {
	// load env for dev
	if os.Getenv("MODE") != "PROD" {
		if err := godotenv.Load(filepath); err != nil {
			log.Fatalf("error getting envvars: %+v\n", err)
		}
	}

	envvars := EnvVars{
		Prod: getVar("MODE") == PROD,
		DB: DB{
			Core: getVar("DB_URL"),
			Test: getVar("DB_URL_TEST"),
		},
		Port:       getVar("PORT"),
		JwtSecret:  getVar("JWT_SECRET"),
		LogFileUrl: getVar("LOG_FILE_URL"),
	}

	return envvars
}

func getVar(s string) string {
	env := os.Getenv(s)
	if env == "" {
		log.Fatalf("env var %s not found", s)
	}
	return env
}
