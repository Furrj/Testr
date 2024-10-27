package envvars

type EnvVars struct {
	Mode            string
	DB              DB
	Port            string
	JwtSecret       string
	SQL             SQL
	ApiKeys         ApiKeys
	ValidationEmail ValidationEmail
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
