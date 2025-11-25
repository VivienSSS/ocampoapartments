package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3912360763")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"cascadeDelete": false,
			"collectionId": "pbc_694062147",
			"hidden": false,
			"id": "relation3776899405",
			"maxSelect": 999,
			"minSelect": 0,
			"name": "items",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "relation"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3912360763")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("relation3776899405")

		return app.Save(collection)
	})
}
