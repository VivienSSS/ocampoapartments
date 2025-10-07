package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_631030571")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "select2223302008",
			"maxSelect": 1,
			"name": "paymentMethod",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"GCash"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_631030571")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "select2223302008",
			"maxSelect": 1,
			"name": "paymentMethod",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Over the counter",
				"GCash"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
