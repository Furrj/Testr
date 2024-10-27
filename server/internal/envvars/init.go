package envvars

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

const ENV_FILEPATH string = "../config/config.env"

func InitEnvVars() EnvVars {
	// load env for dev
	if os.Getenv("MODE") != "PROD" {
		if err := godotenv.Load(ENV_FILEPATH); err != nil {
			log.Fatalf("error getting envvars: %+v\n", err)
		}
	}

	envvars := EnvVars{
		Mode: getVar("MODE"),
		DB: DB{
			Core: getVar("DB_URL"),
			Test: getVar("DB_URL_TEST"),
		},
		Port:      getVar("PORT"),
		JwtSecret: getVar("JWT_SECRET"),
		SQL: SQL{
			CreateTables: getVar("SQL_CREATE_TABLES"),
			DropTables:   getVar("SQL_DROP_TABLES"),
		},
		ApiKeys: ApiKeys{
			Stripe: getVar("STRIPE_KEY"),
		},
		ValidationEmail: ValidationEmail{
			Region:      getVar("AWS_REGION"),
			LinkBaseUrl: getVar("LINK_BASE_URL"),
		},
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
