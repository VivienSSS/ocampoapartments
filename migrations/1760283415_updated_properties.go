package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2037580119")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "select3146128159",
			"maxSelect": 1,
			"name": "branch",
			"presentable": true,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Quezon City",
				"Pampanga"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2037580119")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "select3146128159",
			"maxSelect": 1,
			"name": "branch",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Quezon City",
				"Pampanga"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
