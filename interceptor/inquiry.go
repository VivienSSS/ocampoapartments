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
	emailRecord.Set("message", `<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2>Inquiry Acknowledged</h2>
<p>Thank you for submitting your inquiry.</p>
<div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #5cb85c; margin: 15px 0;">
  <p><strong>Your inquiry has been acknowledged and received.</strong></p>
  <p>We will review your inquiry and return back to you shortly.</p>
</div>
<p>If you have any urgent matters, please contact the management office directly.</p>
</body></html>`)

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
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #5cb85c;">✓ Application Approved</h2>
<p>Congratulations! Your application has been approved.</p>
<div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #5cb85c; margin: 15px 0;">
  <h4>Your Account Credentials:</h4>
  <p><strong>Email:</strong> %s</p>
  <p><strong>Password:</strong> <code style="background-color: #f5f5f5; padding: 5px 8px; border-radius: 3px; font-family: monospace;">%s</code></p>
</div>
<p style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107;"><strong>⚠ Important:</strong> Please log in with these credentials and change your password immediately for security purposes.</p>
<p>Welcome to our community!</p>
</body></html>
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
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #d9534f;">Application Rejected</h2>
<p>We are sorry to inform you that your application has been rejected.</p>
<div style="background-color: #f8d7da; padding: 15px; border-left: 4px solid #d9534f; margin: 15px 0;">
  <p><strong>Rejection Reason:</strong></p>
  <p>%s</p>
</div>
<p>We hope to see you again next time. If you have any questions or would like to appeal this decision, please contact our management office.</p>
</body></html>
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
