package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_699394385")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" ",
			"deleteRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" ",
			"listRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" || (@request.auth.id = user.id)",
			"updateRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" || (@request.auth.id = user.id)",
			"viewRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" || (@request.auth.id = user.id)"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_699394385")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.role = \"Administrator\" ",
			"deleteRule": "@request.auth.role = \"Administrator\" ",
			"listRule": "@request.auth.role = \"Administrator\" || (@request.auth.id = user.id)",
			"updateRule": "@request.auth.role = \"Administrator\" || (@request.auth.id = user.id)",
			"viewRule": "@request.auth.role = \"Administrator\" || (@request.auth.id = user.id)"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
