package aws

import (
	"context"
	"fmt"
	"os"

	ses "github.com/aws/aws-sdk-go-v2/service/sesv2"
	"github.com/aws/aws-sdk-go-v2/service/sesv2/types"
	myTypes "mathtestr.com/server/internal/types"
)

const (
	FROM     string = "Registration@timestrainer.com"
	REGION   string = "us-east-2"
	SUBJECT  string = "Validate Email"
	CHARSET  string = "UTF-8"
	LINK_URL string = `https://timestrainer.com/register/teacher/validate`
	FILEPATH string = "email.html"
)

func SendEmail(client *ses.Client, r myTypes.TeacherRegistration) error {
	// Read the HTML file
	buttonHtml, err := os.ReadFile(FILEPATH)
	if err != nil {
		return err
	}

	from := FROM
	linkUrl := fmt.Sprintf("%s?code=%s&id=%d", LINK_URL, r.Code, r.UserID)
	bodyHtml := fmt.Sprintf(string(buttonHtml), linkUrl)
	bodyText := fmt.Sprintf(`Please go to this link to validate your email address: %s`, LINK_URL)
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
		Destination:      &types.Destination{ToAddresses: []string{r.Email}},
		FromEmailAddress: &from,
	}

	_, err = client.SendEmail(context.TODO(), email)
	if err != nil {
		return err
	}

	return nil
}
