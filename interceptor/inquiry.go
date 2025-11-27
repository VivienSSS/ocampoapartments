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

	if e.Record.GetString("status") != "pending" {
		return e.Next()
	}

	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", e.Record.GetString("email"))
	emailRecord.Set("subject", "Inquiry Acknowledgement")
	emailRecord.Set("message", "Your inquiry has been acknowledged. We will return back to you shortly")

	if err := e.App.Save(emailRecord); err != nil {
		return err
	}

	return e.Next()
}

func SendApproveInquiryToApplicantEmail(e *core.RecordEvent) error {

	if e.Record.GetString("status") != "approved" {
		return e.Next()
	}

	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

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

	// Save user record
	if err := e.App.Save(userRecord); err != nil {
		return err
	}

	// Get tenants collection
	tenantsCollection, err := e.App.FindCollectionByNameOrId("tenants")
	if err != nil {
		return err
	}

	// Create tenant record
	tenantRecord := core.NewRecord(tenantsCollection)
	tenantRecord.Set("user", userRecord.Id)

	// Save tenant record
	if err := e.App.Save(tenantRecord); err != nil {
		return err
	}

	// Create email record for approval
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", e.Record.GetString("email"))
	emailRecord.Set("subject", "Application Approved - Account Created")
	emailRecord.Set("message", fmt.Sprintf(`Your application has been approved. Here are your credentials:

Email: %s
Password: %s

Please log in with these credentials and change your password immediately for security.
Welcome!
	`, e.Record.GetString("email"), password))

	if err := e.App.Save(emailRecord); err != nil {
		return err
	}

	return e.Next()
}

func SendRejectionLetterToApplicantEmail(e *core.RecordEvent) error {

	if e.Record.GetString("status") != "rejected" {
		return e.Next()
	}

	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", e.Record.GetString("email"))
	emailRecord.Set("subject", "Application Rejected")
	emailRecord.Set("message", fmt.Sprintf(`We are sorry to inform you that your application has been rejected.

Reason: %s

We hope to see you again next time. If you have any questions, please contact our management office.
	`, e.Record.GetString("rejectionReason")))

	if err := e.App.Save(emailRecord); err != nil {
		return err
	}

	return e.Next()
}

func SetFirstTimeUserToFalseInUserOnceUserChangeItsPassword(e *core.RecordRequestEvent) error {

	if !e.Record.GetBool("firstTimeUser") {
		return e.Next()
	}

	// Get password from request/form data
	newPassword := e.Request.FormValue("password")

	// If password field was provided and is not empty, user is changing password
	if newPassword != "" {
		e.Record.Set("isActive", true)
		e.Record.Set("isAccepted", true)
		e.Record.Set("firstTimeUser", false)
	}

	return e.Next()
}
