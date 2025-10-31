package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3698950901")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "recent_announcements_chart_view"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_zNUm")

		// remove field
		collection.Fields.RemoveById("_clone_WA1C")

		// remove field
		collection.Fields.RemoveById("_clone_Vqfe")

		// remove field
		collection.Fields.RemoveById("_clone_0T6I")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_X6P4",
			"max": 0,
			"min": 0,
			"name": "title",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"exceptDomains": null,
			"hidden": false,
			"id": "_clone_jpRR",
			"name": "email",
			"onlyDomains": null,
			"presentable": false,
			"required": true,
			"system": true,
			"type": "email"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "_clone_I5yh",
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
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "_clone_4mBQ",
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
		collection, err := app.FindCollectionByNameOrId("pbc_3698950901")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "recent_announcements_stat_card_kpi_view"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_zNUm",
			"max": 0,
			"min": 0,
			"name": "title",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"exceptDomains": null,
			"hidden": false,
			"id": "_clone_WA1C",
			"name": "email",
			"onlyDomains": null,
			"presentable": false,
			"required": true,
			"system": true,
			"type": "email"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "_clone_Vqfe",
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
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "_clone_0T6I",
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
		collection.Fields.RemoveById("_clone_X6P4")

		// remove field
		collection.Fields.RemoveById("_clone_jpRR")

		// remove field
		collection.Fields.RemoveById("_clone_I5yh")

		// remove field
		collection.Fields.RemoveById("_clone_4mBQ")

		return app.Save(collection)
	})
}
