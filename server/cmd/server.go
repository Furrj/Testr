package main

import (
	"fmt"
	"log"
	"os"

	"mathtestr.com/server/internal/routing/routes"
	"mathtestr.com/server/internal/routing/routes/register"
	"mathtestr.com/server/internal/routing/routes/students"
	"mathtestr.com/server/internal/routing/routes/users"

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
		config.AllowMethods = []string{"POST", "GET", "PUT", "DELETE"}
		config.AllowHeaders = []string{consts.HeaderTypeAuthorization, "Content-Type"}
		router.Use(cors.New(config))
	}

	// init middleware handler
	middleware := middleware.NewMiddlewareHandler()
	router.Use(middleware.ValidateAccessToken())

	router.SetTrustedProxies([]string{"127.0.0.1"})

	router.POST(consts.RouteUrlLogin, routes.Login(db))
	router.POST(consts.RouteUrlGameSessions, routes.SubmitGameSession(db))
	router.POST(consts.RouteUrlUpdateVertical, routes.UpdateVertical(db))
	router.POST(consts.RouteUrlClasses, routes.AddClass(db))
	router.POST(consts.RouteUrlRegisterTeacher, register.RegisterTeacher(db))
	router.POST(consts.RouteUrlRegisterStudent, register.RegisterStudent(db))
	router.POST(consts.RouteUrlAddAssignment, routes.AddAssignment(db))
	router.POST(consts.RouteUrlCheckPasswordResetCode, routes.CheckPasswordResetCode(db))

	router.GET(consts.RouteUrlUserData, routes.GetUserData(db))
	router.GET(consts.RouteUrlGetTeacherData, routes.GetTeacherData(db))
	router.GET(consts.RouteUrlGameSessions, routes.GetGameSessions(db))
	router.GET(consts.RouteUrlGetUserInfo, routes.GetUserInfo(db))
	router.GET(consts.RouteUrlCheckUsername, register.CheckUsername(db))
	router.GET(consts.RouteUrlGetTeacherInfoForRegisterPage, register.GetTeacherInfoForRegisterPage(db))
	router.GET(consts.RouteUrlGetAssignmentsTeacher, routes.GetAssignmentsTeacher(db))
	router.GET(consts.RouteUrlGetPasswordResetCode, routes.GetPasswordResetCode(db))
	router.GET(consts.RouteUrlStudent, routes.GetStudentData(db))

	router.PUT(consts.RouteUrlUpdatePassword, users.UpdatePassword(db))
	router.PUT(consts.RouteUrlStudent, students.Update(db))

	router.DELETE(consts.RouteUrlStudent, routes.DeleteStudent(db))

	router.Use(spa.Middleware("/", "client"))

	log.Panic(router.Run(PORT))
}
