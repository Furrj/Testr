package main

import (
	"context"
	"fmt"
	"log"
	"os"

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
	"github.com/joho/godotenv"
	"mathtestr.com/server/internal/routing/consts"
	"mathtestr.com/server/internal/routing/middleware"
)

const ENV string = "../config/config.env"

func main() {
	// load env for dev
	if os.Getenv("MODE") != "PROD" {
		if err := godotenv.Load(ENV); err != nil {
			fmt.Printf("%+v\n", err)
			os.Exit(1)
		}
	}
	PORT := os.Getenv("PORT")
	if PORT == "" {
		fmt.Println("No env variable PORT")
		os.Exit(1)
	}

	// stripe key
	STRIPE_KEY := os.Getenv("STRIPE_KEY")
	if STRIPE_KEY == "" {
		fmt.Fprint(os.Stderr, "STRIPE_KEY env var not found")
		os.Exit(1)
	}

	// db conn
	db, err := dbHandler.InitDBHandler(os.Getenv("DB_URL"))
	if err != nil {
		fmt.Fprintf(os.Stderr, "error initializing db conn: %+v\n", err)
		os.Exit(1)
	}
	defer db.Conn.Close()

	// aws client
	region := os.Getenv("AWS_REGION")
	if region == "" {
		log.Fatalf("AWS_REGION env var not found")
	}
	cfg, err := config.LoadDefaultConfig(
		context.TODO(),
		config.WithRegion(region),
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
	router.POST(consts.RouteUrlPaymentIntents, paymentintents.Create(db, STRIPE_KEY))
	router.POST(consts.RouteUrlCheckoutSession, checkoutsessions.Create(db, STRIPE_KEY))
	router.POST(consts.RouteUrlRegisterTeacherEmail, emailvalidation.SendEmail(db, client))

	router.GET(consts.RouteUrlUser, users.Get(db))
	router.GET(consts.RouteUrlGetTeacherData, teachers.Get(db))
	router.GET(consts.RouteUrlGameSessions, gamesessions.Get(db))
	router.GET(consts.RouteUrlCheckUsername, register.CheckUsername(db))
	router.GET(consts.RouteUrlGetTeacherInfoForRegisterPage, register.GetTeacherInfoForRegisterPage(db))
	router.GET(consts.RouteUrlGetAssignmentsTeacher, teacher_assignments.Get(db))
	router.GET(consts.RouteUrlPasswordResetCode, passwords.Get(db))
	router.GET(consts.RouteUrlStudent, students.Get(db))
	router.GET(consts.RouteUrlCheckoutSessionWithID, checkoutsessions.Get(db, STRIPE_KEY))

	router.PUT(consts.RouteUrlPassword, passwords.Update(db))
	router.PUT(consts.RouteUrlStudent, students.Update(db))
	router.PUT(consts.RouteUrlVertical, vertical.Update(db))

	router.DELETE(consts.RouteUrlStudent, students.Delete(db))
	router.DELETE(consts.RouteUrlPaymentIntentsWithID, paymentintents.Delete(db, STRIPE_KEY))

	router.Use(spa.Middleware("/", "client"))

	log.Panic(router.Run(PORT))
}
