package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2037580119")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" ",
			"deleteRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" ",
			"updateRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" "
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2037580119")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.role = \"Administrator\" ",
			"deleteRule": "@request.auth.role = \"Administrator\" ",
			"updateRule": "@request.auth.role = \"Administrator\" "
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
