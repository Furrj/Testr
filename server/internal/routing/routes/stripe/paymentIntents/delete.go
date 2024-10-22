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

func Delete(db *dbHandler.DBHandler, key string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		stripe.Key = key

		params := &stripe.PaymentIntentCancelParams{}
		_, err := paymentintent.Cancel("pi_3QCnZ1AhU9omvuzo1MOg1L5x", params)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error cancelling payment intent: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		ctx.Status(http.StatusOK)
	}
}
