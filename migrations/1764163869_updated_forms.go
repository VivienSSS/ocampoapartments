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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(10, []byte(`{
			"hidden": false,
			"id": "select914408790",
			"maxSelect": 1,
			"name": "orientation",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"vertical",
				"horizontal",
				"responsive"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(11, []byte(`{
			"hidden": false,
			"id": "bool2549271944",
			"name": "separator",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "bool"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_913941788")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("select914408790")

		// remove field
		collection.Fields.RemoveById("bool2549271944")

		return app.Save(collection)
	})
}
