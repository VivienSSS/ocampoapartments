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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(9, []byte(`{
			"hidden": false,
			"id": "file3047641822",
			"maxSelect": 1,
			"maxSize": 0,
			"mimeTypes": [],
			"name": "qr_image_proof",
			"presentable": false,
			"protected": false,
			"required": false,
			"system": false,
			"thumbs": [],
			"type": "file"
		}`)); err != nil {
			return err
		}

		// add field
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
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3412753434")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("file3047641822")

		// remove field
		collection.Fields.RemoveById("select517487686")

		return app.Save(collection)
	})
}
