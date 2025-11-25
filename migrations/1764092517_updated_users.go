package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("email1401528724")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(11, []byte(`{
			"exceptDomains": [],
			"hidden": false,
			"id": "email1401528724",
			"name": "contactEmail",
			"onlyDomains": [],
			"presentable": false,
			"required": true,
			"system": false,
			"type": "email"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
