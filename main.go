package main

import (
	"log"
	"os"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"

	_ "github.com/VivienSSS/ocampoapartments/migrations"
	"github.com/VivienSSS/ocampoapartments/workers"
)

func main() {
	app := pocketbase.New()

	// migration command
	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: true,
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		se.Router.GET("/{path...}", apis.Static(os.DirFS("./dist"), true))
		return se.Next()
	})

	// events
	workers.PaymentNotification(app)

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
