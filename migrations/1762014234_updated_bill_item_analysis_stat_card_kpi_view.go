package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3480312777")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"listRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\"",
			"viewRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\""
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_noSK")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_K7hN",
			"maxSelect": 1,
			"name": "chargeType",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Rent",
				"Water",
				"Electricity",
				"Miscellaneous"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3480312777")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"listRule": "",
			"viewRule": ""
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_noSK",
			"maxSelect": 1,
			"name": "chargeType",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Rent",
				"Water",
				"Electricity",
				"Miscellaneous"
			]
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_K7hN")

		return app.Save(collection)
	})
}
