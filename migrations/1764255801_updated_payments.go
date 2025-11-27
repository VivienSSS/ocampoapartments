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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(9, []byte(`{
			"hidden": false,
			"id": "select1457791193",
			"maxSelect": 1,
			"name": "paymentType",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"Refund",
				"Transaction"
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

		// remove field
		collection.Fields.RemoveById("select1457791193")

		return app.Save(collection)
	})
}
