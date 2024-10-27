package checkoutsessions

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/stripe/stripe-go/v80/checkout/session"
	"mathtestr.com/server/internal/dbHandler"
)

type resGetCheckoutSessionStatus struct {
	Status        string `json:"status"`
	CustomerEmail string `json:"customer_email"`
}

func Get(db *dbHandler.DBHandler, key string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		id := ctx.Param("id")
		fmt.Println(id)

		s, err := session.Get(id, nil)
		if err != nil {
			fmt.Fprintf(os.Stderr, "error getting checkout session: %+v\n", err)
			ctx.Status(http.StatusBadRequest)
			return
		}

		res := resGetCheckoutSessionStatus{
			Status:        string(s.Status),
			CustomerEmail: s.CustomerEmail,
		}

		ctx.JSON(http.StatusOK, res)
	}
}
