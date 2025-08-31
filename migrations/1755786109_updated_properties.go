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

		// remove field
		collection.Fields.RemoveById("text1579384326")

		// add field
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
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2037580119")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text1579384326",
			"max": 0,
			"min": 0,
			"name": "name",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("select3146128159")

		return app.Save(collection)
	})
}
