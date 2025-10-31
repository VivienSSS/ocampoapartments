package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1395653745")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "property_summary_chart_view"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_ob7g")

		// remove field
		collection.Fields.RemoveById("_clone_1hnI")

		// remove field
		collection.Fields.RemoveById("_clone_i439")

		// remove field
		collection.Fields.RemoveById("_clone_aKX3")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "_clone_vafl",
			"maxSize": 0,
			"name": "address",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "_clone_iPQu",
			"maxSelect": 1,
			"name": "branch",
			"presentable": true,
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
			"hidden": false,
			"id": "_clone_YgRd",
			"name": "created",
			"onCreate": true,
			"onUpdate": false,
			"presentable": false,
			"system": false,
			"type": "autodate"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"hidden": false,
			"id": "_clone_pa2n",
			"name": "updated",
			"onCreate": true,
			"onUpdate": true,
			"presentable": false,
			"system": false,
			"type": "autodate"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1395653745")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "property_summary_stat_card_kpi_view"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "_clone_ob7g",
			"maxSize": 0,
			"name": "address",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "_clone_1hnI",
			"maxSelect": 1,
			"name": "branch",
			"presentable": true,
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

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
			"hidden": false,
			"id": "_clone_i439",
			"name": "created",
			"onCreate": true,
			"onUpdate": false,
			"presentable": false,
			"system": false,
			"type": "autodate"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"hidden": false,
			"id": "_clone_aKX3",
			"name": "updated",
			"onCreate": true,
			"onUpdate": true,
			"presentable": false,
			"system": false,
			"type": "autodate"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_vafl")

		// remove field
		collection.Fields.RemoveById("_clone_iPQu")

		// remove field
		collection.Fields.RemoveById("_clone_YgRd")

		// remove field
		collection.Fields.RemoveById("_clone_pa2n")

		return app.Save(collection)
	})
}
