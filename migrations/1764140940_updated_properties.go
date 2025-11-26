package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2037580119")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"indexes": [
				"CREATE INDEX ` + "`" + `idx_1JuF3a00Jz` + "`" + ` ON ` + "`" + `properties` + "`" + ` (` + "`" + `branch` + "`" + `)"
			]
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("editor223244161")

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2037580119")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_1JuF3a00Jz` + "`" + ` ON ` + "`" + `properties` + "`" + ` (\n  ` + "`" + `branch` + "`" + `,\n  ` + "`" + `address` + "`" + `\n)"
			]
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "editor223244161",
			"maxSize": 0,
			"name": "address",
			"presentable": true,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
