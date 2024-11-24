package env

const (
	PROD string = "PROD"
	DEV  string = "DEV"
)

type EnvVars struct {
	DB         DB
	Port       string
	JwtSecret  string
	LogFileUrl string
	Prod       bool
}

type DB struct {
	Core string
	Test string
}

type SQL struct {
	CreateTables string
	DropTables   string
}

type ApiKeys struct {
	Stripe string
}

type ValidationEmail struct {
	Region      string
	LinkBaseUrl string
}
