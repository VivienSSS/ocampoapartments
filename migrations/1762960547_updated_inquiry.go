package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3412753434")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(10, []byte(`{
			"hidden": false,
			"id": "select517487686",
			"maxSelect": 1,
			"name": "submission_type",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"Payment for deposit",
				"Payment for advance"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3412753434")
		if err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(10, []byte(`{
			"hidden": false,
			"id": "select517487686",
			"maxSelect": 1,
			"name": "submission_type",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"submit proof of payment  for deposit",
				"submit proof of payment for advance"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
