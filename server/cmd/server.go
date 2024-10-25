package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"mathtestr.com/server/internal/envvars"
	"mathtestr.com/server/internal/routing/routes/assignments"
	"mathtestr.com/server/internal/routing/routes/gamesessions"
	"mathtestr.com/server/internal/routing/routes/login"
	"mathtestr.com/server/internal/routing/routes/register"
	emailvalidation "mathtestr.com/server/internal/routing/routes/register/emailValidation"
	checkoutsessions "mathtestr.com/server/internal/routing/routes/stripe/checkoutSessions"
	paymentintents "mathtestr.com/server/internal/routing/routes/stripe/paymentIntents"
	"mathtestr.com/server/internal/routing/routes/students"
	"mathtestr.com/server/internal/routing/routes/teachers"
	teacher_assignments "mathtestr.com/server/internal/routing/routes/teachers/assignments"
	"mathtestr.com/server/internal/routing/routes/teachers/classes"
	"mathtestr.com/server/internal/routing/routes/users"
	"mathtestr.com/server/internal/routing/routes/users/passwords"
	"mathtestr.com/server/internal/routing/routes/users/vertical"

	ses "github.com/aws/aws-sdk-go-v2/service/sesv2"

	"mathtestr.com/server/internal/dbHandler"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/gin-contrib/cors"
	"github.com/mandrigin/gin-spa/spa"

	"github.com/gin-gonic/gin"
	"mathtestr.com/server/internal/routing/consts"
	"mathtestr.com/server/internal/routing/middleware"
)

func main() {
	// load envvars
	envVars := envvars.InitEnvVars()

	// db conn
	db, err := dbHandler.InitDBHandler(envVars.DB.Core)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error initializing db conn: %+v\n", err)
		os.Exit(1)
	}
	defer db.Conn.Close()

	// aws client
	cfg, err := config.LoadDefaultConfig(
		context.TODO(),
		config.WithRegion(envVars.ValidationEmail.Region),
	)
	if err != nil {
		log.Fatalf("error establishing aws client: %+v\n", err)
	}

	client := ses.NewFromConfig(cfg)

	// init router
	router := gin.Default()

	// gin config
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

	// register routes
	router.POST(consts.RouteUrlLogin, login.Login(db))
	router.POST(consts.RouteUrlGameSessions, gamesessions.Add(db))
	router.POST(consts.RouteUrlClasses, classes.Add(db))
	router.POST(consts.RouteUrlRegisterTeacher, register.RegisterTeacher(db))
	router.POST(consts.RouteUrlRegisterStudent, register.RegisterStudent(db))
	router.POST(consts.RouteUrlAssignment, assignments.Add(db))
	router.POST(consts.RouteUrlPasswordResetCodeCheck, passwords.CheckResetCode(db))
	router.POST(consts.RouteUrlPaymentIntents, paymentintents.Create(db, envVars.ApiKeys.Stripe))
	router.POST(consts.RouteUrlCheckoutSession, checkoutsessions.Create(db, envVars.ApiKeys.Stripe))
	router.POST(consts.RouteUrlRegisterTeacherEmail, emailvalidation.Send(db, client, envVars))
	router.POST(consts.RouteUrlRegisterTeacherEmailValidation, emailvalidation.Verify(db))

	router.GET(consts.RouteUrlUser, users.Get(db))
	router.GET(consts.RouteUrlGetTeacherData, teachers.Get(db))
	router.GET(consts.RouteUrlGameSessions, gamesessions.Get(db))
	router.GET(consts.RouteUrlCheckUsername, register.CheckUsername(db))
	router.GET(consts.RouteUrlGetTeacherInfoForRegisterPage, register.GetTeacherInfoForRegisterPage(db))
	router.GET(consts.RouteUrlGetAssignmentsTeacher, teacher_assignments.Get(db))
	router.GET(consts.RouteUrlPasswordResetCode, passwords.Get(db))
	router.GET(consts.RouteUrlStudent, students.Get(db))
	router.GET(consts.RouteUrlCheckoutSessionWithID, checkoutsessions.Get(db, envVars.ApiKeys.Stripe))

	router.PUT(consts.RouteUrlPassword, passwords.Update(db))
	router.PUT(consts.RouteUrlStudent, students.Update(db))
	router.PUT(consts.RouteUrlVertical, vertical.Update(db))

	router.DELETE(consts.RouteUrlStudent, students.Delete(db))
	router.DELETE(consts.RouteUrlPaymentIntentsWithID, paymentintents.Delete(db, envVars.ApiKeys.Stripe))

	router.Use(spa.Middleware("/", "client"))

	log.Panic(router.Run(envVars.Port))
}
