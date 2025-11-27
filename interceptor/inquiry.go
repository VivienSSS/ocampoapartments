package interceptor

import (
	"fmt"
	mrand "math/rand"

	"github.com/pocketbase/pocketbase/core"
)

func generatePassword() string {
	const (
		uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
		lowercase = "abcdefghijklmnopqrstuvwxyz"
		numbers   = "0123456789"
		special   = "!@#$%^&*"
	)

	all := uppercase + lowercase + numbers + special
	password := make([]byte, 16)

	// Ensure at least one of each type
	password[0] = uppercase[mrand.Intn(len(uppercase))]
	password[1] = lowercase[mrand.Intn(len(lowercase))]
	password[2] = numbers[mrand.Intn(len(numbers))]
	password[3] = special[mrand.Intn(len(special))]

	// Fill the rest randomly
	for i := 4; i < 16; i++ {
		password[i] = all[mrand.Intn(len(all))]
	}

	// Shuffle to randomize positions
	for i := len(password) - 1; i > 0; i-- {
		j := mrand.Intn(i + 1)
		password[i], password[j] = password[j], password[i]
	}

	return string(password)
}

func SendInquiryAcknoledgementToApplicantEmail(e *core.RecordEvent) error {

	if (e.Record.GetString("status") != "pending") {
		return e.Next()
	}

	emailCollection, err := e.App.FindCollectionByNameOrId("emails")

	if err != nil {
		return err
	}

	emailRecord := core.NewRecord(emailCollection)

	emailRecord.Set("to",e.Record.GetString("email"))
	emailRecord.Set("message","Your inquiry has been acknowledge. we will return back to you shortly")

	e.App.Save(emailRecord)

	return e.Next()
}

func SendApproveInquiryToApplicantEmail(e *core.RecordEvent) error {

	if (e.Record.GetString("status") != "approved") {
		return e.Next()
	}

	emailCollection, err := e.App.FindCollectionByNameOrId("emails")

	if err != nil {
		return err
	}

	// create a new account for the tenant
	// Get users collection
	usersCollection, err := e.App.FindCollectionByNameOrId("_pb_users_auth_")
	
	if err != nil {
		return err
	}

	password := generatePassword()

	// Create user record
	userRecord := core.NewRecord(usersCollection)
	userRecord.Set("email", e.Record.GetString("email"))
	userRecord.Set("username", e.Record.GetString("email"))
	userRecord.Set("password", password)
	userRecord.Set("firstName", e.Record.GetString("firstName"))
	userRecord.Set("lastName", e.Record.GetString("lastName"))
	userRecord.Set("role", "Tenant")
	userRecord.Set("firstTimeUser", true)

	// save
	e.App.Save(userRecord)

	emailRecord := core.NewRecord(emailCollection)

	emailRecord.Set("to",e.Record.GetString("email"))
	emailRecord.Set("message",fmt.Sprintf(`
		Your application has been approved. here are your credentials

		email: %s
		password: %s
	`,
	e.Record.GetString("email"),
	password,
	))

	e.App.Save(emailRecord)

	return e.Next()
}

func SendRejectionLetterToApplicantEmail(e *core.RecordEvent) error {
	
	if (e.Record.GetString("status") != "rejected") {
		return e.Next()
	}

	emailCollection, err := e.App.FindCollectionByNameOrId("emails")

	if err != nil {
		return err
	}

	emailRecord := core.NewRecord(emailCollection)

	emailRecord.Set("to",e.Record.Get("email"))
	emailRecord.Set("message",fmt.Sprintf(`
		We are sorry to inform your that your application has been rejected:

		Reason: %s

		We hope to see you again next time
	`,e.Record.GetString("rejectionReason")))

	e.App.Save(emailRecord)
	
	return e.Next()
}

func SetFirstTimeUserToFalseInUserOnceUserChangeItsPassword(e *core.RecordEvent) error {

	if (!e.Record.GetBool("firstTimeUser")) {
		return e.Next()
	}

	e.Record.Set("isActive", true)
	e.Record.Set("isAccepted", true)
	e.Record.Set("firstTimeUser",false)

	return e.Next()
}