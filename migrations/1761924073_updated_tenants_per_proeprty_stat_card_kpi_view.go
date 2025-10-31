package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2634964219")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "tenants_per_property_chart_view"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_mE4t")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "_clone_s24C",
			"maxSize": 0,
			"name": "address",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2634964219")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "tenants_per_proeprty_stat_card_kpi_view"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "_clone_mE4t",
			"maxSize": 0,
			"name": "address",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_s24C")

		return app.Save(collection)
	})
}
