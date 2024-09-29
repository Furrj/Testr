package main

import (
	"fmt"
	"log"
	"os"

	"mathtestr.com/server/internal/routing/routes"

	"mathtestr.com/server/internal/dbHandler"

	"github.com/gin-contrib/cors"
	"github.com/mandrigin/gin-spa/spa"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"mathtestr.com/server/internal/routing/consts"
	"mathtestr.com/server/internal/routing/middleware"
)

func main() {
	// ENV CONFIG
	if os.Getenv("MODE") != "PROD" {
		if err := godotenv.Load("../config/config.env"); err != nil {
			fmt.Printf("%+v\n", err)
			os.Exit(1)
		}
	}
	PORT := os.Getenv("PORT")
	if PORT == "" {
		fmt.Println("No env variable PORT")
		os.Exit(1)
	}

	// Test backup
	// cmd := exec.Command("./backup.sh")
	// if err := cmd.Run(); err != nil {
	// 	log.Printf("Error backing up Postgres: %+v\n", err)
	// }

	// Conn
	db, err := dbHandler.InitDBHandler(os.Getenv("DB_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "error initializing db conn: %+v\n", err)
		os.Exit(1)
	}
	defer db.Conn.Close()

	// ROUTING
	router := gin.Default()
	if os.Getenv("MODE") == "DEV" {
		fmt.Println("**DEV MODE DETECTED, ENABLING CORS**")
		config := cors.DefaultConfig()
		config.AllowOrigins = []string{"http://localhost:5000", "http://localhost:5173"}
		config.AllowCredentials = true
		config.AllowMethods = []string{"POST", "GET"}
		config.AllowHeaders = []string{consts.HeaderTypeAuthorization, "Content-Type"}
		router.Use(cors.New(config))
	}

	// init middleware handler
	middleware := middleware.NewMiddlewareHandler()
	router.Use(middleware.ValidateAccessToken())

	router.SetTrustedProxies([]string{"127.0.0.1"})

	router.POST(consts.RouteUrlRegister, routes.Register(db))
	router.POST(consts.RouteUrlLogin, routes.Login(db))
	router.POST(consts.RouteUrlValidateSession, routes.ValidateSession(db))
	router.POST(consts.RouteUrlSubmitGameSession, routes.SubmitGameSession(db))
	router.POST(consts.RouteUrlUpdateVertical, routes.UpdateVertical(db))
	router.POST(consts.RouteUrlAddClass, routes.AddClass(db))
	router.POST(consts.RouteUrlRegisterTeacher, routes.RegisterTeacher(db))

	router.GET(consts.RouteUrlGetGameSessions, routes.GetGameSessions(db))
	router.GET(consts.RouteUrlGetStudents, routes.GetStudents(db))
	router.GET(consts.RouteUrlGetUserInfo, routes.GetUserInfo(db))
	router.GET(consts.RouteUrlGetClasses, routes.GetClasses(db))

	router.Use(spa.Middleware("/", "client"))

	log.Panic(router.Run(PORT))
}
