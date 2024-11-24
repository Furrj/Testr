package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/Furrj/timestrainer/server/internal/api"
	"github.com/Furrj/timestrainer/server/internal/api/handlers"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/classify"
	"github.com/Furrj/timestrainer/server/internal/api/middleware/cors"
	logMw "github.com/Furrj/timestrainer/server/internal/api/middleware/log"
	"github.com/Furrj/timestrainer/server/internal/db"
	"github.com/Furrj/timestrainer/server/internal/services"
	"github.com/Furrj/timestrainer/server/internal/services/env"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"github.com/sirupsen/logrus"
)

const (
	envFilePath = ".env"
)

func main() {
	// logger
	log := logrus.New()

	// env vars
	envvars := env.FetchEnvVars(envFilePath, log)

	// log file
	file, err := os.OpenFile(envvars.LogFileUrl, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0666)
	if err != nil {
		log.Fatal(err)
	}

	// load env if neccesary
	if envvars.Prod {
		log.Out = file
	} else {
		log.Info("*****DEV MODE*****")

		err := godotenv.Load(envFilePath)
		if err != nil {
			log.Fatal(err)
		}
	}

	// db conn
	conn, err := pgxpool.New(context.Background(), envvars.DB.Core)
	if err != nil {
		log.Fatal(err)
	}
	qry := db.New(conn)

	services := services.NewServices(log, qry, envvars)

	// muxer
	r := http.NewServeMux()
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodOptions {
			fmt.Println("OPTIONS")
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Access-Control-Allow-Credentials", "true")
			w.WriteHeader(http.StatusNoContent)
			return
		}
	})

	// si
	si := handlers.NewRouteHandler(services)
	// middleware
	m := []api.MiddlewareFunc{
		classify.Classify,
		logMw.Log(log),
	}
	if !envvars.Prod {
		m = append(m, cors.HandleCors)
	}
	// options
	o := api.StdHTTPServerOptions{
		BaseURL:     "",
		BaseRouter:  r,
		Middlewares: m,
		ErrorHandlerFunc: func(w http.ResponseWriter, r *http.Request, err error) {
			log.Error(err.Error())
		},
	}

	// handler
	h := api.HandlerWithOptions(si, o)
	// h := api.HandlerFromMux(si, r)

	// http server
	s := &http.Server{
		Handler: h,
		Addr:    fmt.Sprintf("localhost:%s", envvars.Port),
	}

	// serve
	log.Fatal(s.ListenAndServe())
}
