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
	logMw := logMw.Log(log)

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
	// handle preflight
	var allowed string
	if envvars.Prod {
		allowed = "/"
	} else {
		allowed = "http://localhost:5173"
	}
	r.Handle("OPTIONS /api/", logMw(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", allowed)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Credentials", "true")
		w.WriteHeader(http.StatusNoContent)
	})))

	// serve client
	r.Handle("GET /assets/", logMw(http.StripPrefix("/assets/", http.FileServer(http.Dir("./client/assets")))))

	r.Handle("GET /", logMw(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./client/index.html")
	})))

	// si
	si := handlers.NewRouteHandler(services)
	// middleware
	m := []api.MiddlewareFunc{
		classify.Classify,
		logMw,
	}
	if !envvars.Prod {
		log.Info("*****ENABLING DEV CORS*****")
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
	log.Info("listening on port ", envvars.Port)
	log.Fatal(s.ListenAndServe())
}
