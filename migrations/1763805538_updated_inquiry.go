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

		// remove field
		collection.Fields.RemoveById("select8393012345")

		// remove field
		collection.Fields.RemoveById("editor9393012346")

		// remove field
		collection.Fields.RemoveById("editor9393012347")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3412753434")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(15, []byte(`{
			"hidden": false,
			"id": "select8393012345",
			"maxSelect": 1,
			"name": "approval_status",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"pending",
				"approved",
				"rejected"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(16, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "editor9393012346",
			"maxSize": 0,
			"name": "approval_notes",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(17, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "editor9393012347",
			"maxSize": 0,
			"name": "rejection_reason",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
