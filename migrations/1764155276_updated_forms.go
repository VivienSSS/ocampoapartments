package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_913941788")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "select427927149",
			"maxSelect": 2,
			"name": "operation",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"create",
				"update"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_913941788")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "select427927149",
			"maxSelect": 1,
			"name": "operation",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"create",
				"update"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
