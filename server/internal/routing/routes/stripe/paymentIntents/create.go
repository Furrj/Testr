package paymentintents

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	stripe "github.com/stripe/stripe-go/v80"
	"github.com/stripe/stripe-go/v80/paymentintent"
	"mathtestr.com/server/internal/dbHandler"
)

type reqCreatePaymentIntent struct {
	Type uint `json:"type"`
}

type resCreatePaymentIntent struct {
	ClientSecret string `json:"client_secret"`
}

func Create(db *dbHandler.DBHandler, key string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		var payload reqCreatePaymentIntent

		// bind request body
		if err := ctx.BindJSON(&payload); err != nil {
			fmt.Fprintf(os.Stderr, "error binding json: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}
		fmt.Printf("%+v\n", payload)

		// create intent
		stripe.Key = key

		params := &stripe.PaymentIntentParams{
			Amount:   stripe.Int64(1099),
			Currency: stripe.String(string(stripe.CurrencyUSD)),
		}
		intent, err := paymentintent.New(params)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error creating payment intent: %+v\n", err)
			ctx.Status(http.StatusInternalServerError)
			return
		}

		res := resCreatePaymentIntent{
			ClientSecret: intent.ClientSecret,
		}

		ctx.JSON(http.StatusOK, res)
	}
}
