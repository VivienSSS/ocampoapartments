package main

import (
	"fmt"
	"log"
	mrand "math/rand"
	"os"
	"time"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	"github.com/VivienSSS/ocampoapartments/interceptor"
	_ "github.com/VivienSSS/ocampoapartments/migrations"
)

// generatePassword creates a secure 16-character password with mixed character types
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

func main() {
	app := pocketbase.New()

	// migration command
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: true,
	})

	// Hook 1: Auto-generate OTP code on creation
	// Generates a 6-digit code and sets expiresAt to now + 5 minutes
	app.OnRecordCreate("otp").BindFunc(func(e *core.RecordEvent) error {
		// Generate 6-digit code
		code := fmt.Sprintf("%06d", mrand.Intn(1000000))
		e.Record.Set("code", code)

		// Set expiresAt to now + 5 minutes
		expiresAt := time.Now().Add(5 * time.Minute)
		e.Record.Set("expiresAt", expiresAt)

		return e.Next()
	})

	// Hook 2: Reset expiresAt when hasSent is updated to true
	// Gives a fresh 5-minute window after n8n sends the OTP
	app.OnRecordUpdate("otp").BindFunc(func(e *core.RecordEvent) error {
		// Check if hasSent was just set to true
		hasSent := e.Record.GetBool("hasSent")
		oldHasSent := false

		// Get the old record to compare
		oldRecord, err := app.FindRecordById("otp", e.Record.Id)
		if err == nil {
			oldHasSent = oldRecord.GetBool("hasSent")
		}

		// If hasSent was just changed to true, reset expiresAt
		if hasSent && !oldHasSent {
			expiresAt := time.Now().Add(5 * time.Minute)
			e.Record.Set("expiresAt", expiresAt)
		}

		return e.Next()
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		// Custom endpoint for creating account from inquiry
		se.Router.POST("/api/inquiry/create-account", func(e *core.RequestEvent) error {
			inquiryId := e.Request.FormValue("inquiryId")

			if inquiryId == "" {
				return e.JSON(400, map[string]string{"error": "inquiryId is required"})
			}

			// Get the inquiry
			inquiry, err := app.FindRecordById("inquiry", inquiryId)
			if err != nil {
				return e.JSON(404, map[string]string{"error": "Inquiry not found"})
			}

			// Check if inquiry is approved
			if inquiry.GetString("approval_status") != "approved" {
				return e.JSON(400, map[string]string{"error": "Inquiry must be approved first"})
			}

			// Generate temporary password
			password := generatePassword()

			// Get users collection
			usersCollection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
			if err != nil {
				return e.JSON(500, map[string]string{"error": "Users collection not found"})
			}

			// Create user record
			user := core.NewRecord(usersCollection)
			user.Set("email", inquiry.GetString("email"))
			user.Set("username", inquiry.GetString("email"))
			user.Set("password", password)
			user.Set("firstName", inquiry.GetString("firstName"))
			user.Set("lastName", inquiry.GetString("lastName"))
			user.Set("role", "Tenant")
			user.Set("isActive", true)
			user.Set("isAccepted", true)

			if err := app.Save(user); err != nil {
				return e.JSON(500, map[string]string{"error": "Failed to create user: " + err.Error()})
			}

			// Get tenants collection
			tenantCollection, err := app.FindCollectionByNameOrId("tenants")
			if err != nil {
				return e.JSON(500, map[string]string{"error": "Tenants collection not found"})
			}

			// Create tenant record linking to user
			tenant := core.NewRecord(tenantCollection)
			tenant.Set("user", user.Id)
			tenant.Set("phoneNumber", inquiry.GetString("phone"))

			if err := app.Save(tenant); err != nil {
				return e.JSON(500, map[string]string{"error": "Failed to create tenant: " + err.Error()})
			}

			// Update inquiry approval_status to track account creation
			inquiry.Set("approval_status", "approved")
			if err := app.Save(inquiry); err != nil {
				return e.JSON(500, map[string]string{"error": "Failed to update inquiry: " + err.Error()})
			}

			// Return credentials for email sending
			return e.JSON(200, map[string]interface{}{
				"user_id":    user.Id,
				"email":      user.GetString("email"),
				"password":   password,
				"tenant_id":  tenant.Id,
				"first_name": user.GetString("firstName"),
				"last_name":  user.GetString("lastName"),
			})
		})

		se.Router.GET("/{path...}", apis.Static(os.DirFS("./dist"), true))
		return se.Next()
	})

	// interceptors
	app.OnRecordCreateRequest("announcements").BindFunc(interceptor.AddAuthorToAnnouncements)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
