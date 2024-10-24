package aws

import (
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/config"
	ses "github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
	"github.com/google/uuid"
)

func SendEmail(code uuid.UUID) error {
	cfg, err := config.LoadDefaultConfig(
		context.TODO(),
		config.WithRegion(REGION),
	)
	if err != nil {
		return err
	}

	client := ses.NewFromConfig(cfg)

	from := FROM
	bodyHtml := fmt.Sprintf(`Please click on this link to validate your email address: <a href="%s/%s">VALIDATE</a>`, LINK_URL, code)
	bodyText := fmt.Sprintf(`Please go to this link to validate your email address: %s/%s`, LINK_URL, code)
	charset := CHARSET
	subject := SUBJECT

	email := &ses.SendEmailInput{
		Content: &types.EmailContent{
			Simple: &types.Message{
				Body: &types.Body{
					Html: &types.Content{
						Data:    &bodyHtml,
						Charset: &charset,
					},
					Text: &types.Content{
						Data:    &bodyText,
						Charset: &charset,
					},
				},
				Subject: &types.Content{
					Data:    &subject,
					Charset: &charset,
				},
			},
		},
		Destination:      &types.Destination{ToAddresses: []string{TO}},
		FromEmailAddress: &from,
	}
	_, err = client.SendEmail(context.TODO(), email)
	if err != nil {
		return err
	}

	return nil
}

const (
	TO        string = "jackson.a.furr@gmail.com"
	FROM      string = "Registration@timestrainer.com"
	REGION    string = "us-east-2"
	SUBJECT   string = "Validate Email"
	BODY_HTML string = `Please click on this link to validate your account: <a href="https://timestrainer.com">Validate</a>`
	BODY_TEXT string = `Please go to this link to validate your account: https://timestrainer.com`
	CHARSET   string = "UTF-8"
	LINK_URL  string = `https://timestrainer.com/register/teacher/validate`
)
