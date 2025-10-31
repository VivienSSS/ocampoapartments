package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3813771158")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "bills_by_status_chart_view"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_bJG2")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_Y8xt",
			"maxSelect": 1,
			"name": "status",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Paid",
				"Due",
				"Overdue"
			]
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3813771158")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"name": "bills_by_status_stat_card_kpi_view"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"hidden": false,
			"id": "_clone_bJG2",
			"maxSelect": 1,
			"name": "status",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Paid",
				"Due",
				"Overdue"
			]
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_Y8xt")

		return app.Save(collection)
	})
}
