package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3912360763")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.role = \"Administrator\"",
			"deleteRule": "@request.auth.role = \"Administrator\"",
			"listRule": "@request.auth.role = \"Administrator\"",
			"updateRule": "@request.auth.role = \"Administrator\"",
			"viewRule": "@request.auth.role = \"Administrator\""
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3912360763")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "",
			"deleteRule": "",
			"listRule": "",
			"updateRule": "",
			"viewRule": ""
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
