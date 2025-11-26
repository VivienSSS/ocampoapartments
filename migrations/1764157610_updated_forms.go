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
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "select4232930610",
			"maxSelect": 1,
			"name": "collection",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"announcements",
				"properties",
				"inquiries",
				"apartment_units",
				"tenants",
				"tenancies",
				"billing",
				"payments",
				"maintenance_workers",
				"maintenance_requests"
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
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "select4232930610",
			"maxSelect": 1,
			"name": "collection",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"announcements",
				"properties"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
