package checkoutsessions

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	stripe "github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/checkout/session"
	"mathtestr.com/server/internal/dbHandler"
)

type reqCreateCheckoutSession struct {
	MembershipType uint `json:"membership_type"`
}

type resCreateCheckoutSession struct {
	ClientSecret string `json:"client_secret"`
}

func Create(db *dbHandler.DBHandler, key string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		domain := "http://localhost:5173/"
		var payload reqCreateCheckoutSession

		// bind request body
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding json: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		fmt.Printf("%+v\n", payload)

		// create session
		stripe.Key = key
		params := &stripe.CheckoutSessionParams{
			Mode:      stripe.String(string(stripe.CheckoutSessionModeSubscription)),
			UIMode:    stripe.String("embedded"),
			ReturnURL: stripe.String(domain + "/checkout/completed?session_id={CHECKOUT_SESSION_ID}"),
			LineItems: []*stripe.CheckoutSessionLineItemParams{
				{
					Price:    stripe.String("price_1QCsKbAhU9omvuzoK1wwfNok"),
					Quantity: stripe.Int64(1),
				},
			},
			AllowPromotionCodes: stripe.Bool(true),
			AutomaticTax:        &stripe.CheckoutSessionAutomaticTaxParams{Enabled: stripe.Bool(true)},
		}

		s, err := session.New(params)
		if err != nil {
			log.Printf("session.New: %v", err)
		}

		fmt.Printf("%+v\n", s)

		res := resCreateCheckoutSession{ClientSecret: s.ClientSecret}
		ctx.JSON(http.StatusOK, res)
	}
}
