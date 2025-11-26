package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_631030571")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_03AYtckr4g` + "`" + ` ON ` + "`" + `payments` + "`" + ` (\n  ` + "`" + `bill` + "`" + `,\n  ` + "`" + `tenant` + "`" + `,\n  ` + "`" + `paymentDate` + "`" + `,\n  ` + "`" + `transactionId` + "`" + `\n)"
			]
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_631030571")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_03AYtckr4g` + "`" + ` ON ` + "`" + `payments` + "`" + ` (\n  ` + "`" + `bill` + "`" + `,\n  ` + "`" + `tenant` + "`" + `,\n  ` + "`" + `paymentDate` + "`" + `\n)"
			]
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
