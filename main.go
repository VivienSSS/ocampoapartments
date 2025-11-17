package main

import (
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "github.com/VivienSSS/ocampoapartments/migrations"
)

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
		code := fmt.Sprintf("%06d", rand.Intn(1000000))
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
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./dist"), true))
		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
