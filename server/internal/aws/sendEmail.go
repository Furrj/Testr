package aws

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/config"
	ses "github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
)

func SendEmail() {
	cfg, err := config.LoadDefaultConfig(
		context.TODO(),
		config.WithRegion(REGION),
	)
	if err != nil {
		log.Fatalf("Error loading aws config: %+v\n", err)
	}

	client := ses.NewFromConfig(cfg)

	from := FROM

	email := &ses.SendEmailInput{
		Content: &types.EmailContent{
			Raw: &types.RawMessage{Data: []byte(EMAIL_STR)},
		},
		Destination:      &types.Destination{ToAddresses: []string{TO}},
		FromEmailAddress: &from,
	}
	res, err := client.SendEmail(context.TODO(), email)
	if err != nil {
		log.Printf("error sending email: %+v\n", err)
	}

	log.Printf("res: %+v\n", *res)
}

const (
	TO     string = "jackson.a.furr@gmail.com"
	FROM   string = "registration@timestrainer.com"
	REGION string = "us-east-2"
)
