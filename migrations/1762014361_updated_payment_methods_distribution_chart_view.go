package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1121552745")
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
		collection.Fields.RemoveById("_clone_rzFe")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_w8vl",
			"maxSelect": 1,
			"name": "paymentMethod",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"GCash"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1121552745")
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
			"id": "_clone_rzFe",
			"maxSelect": 1,
			"name": "paymentMethod",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"GCash"
			]
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_w8vl")

		return app.Save(collection)
	})
}
