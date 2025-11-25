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

		return app.Delete(collection)
	}, func(app core.App) error {
		jsonData := `{
			"createRule": null,
			"deleteRule": null,
			"fields": [
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text3208210256",
					"max": 0,
					"min": 0,
					"name": "id",
					"pattern": "^[a-z0-9]+$",
					"presentable": false,
					"primaryKey": true,
					"required": true,
					"system": true,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "_clone_KGGk",
					"maxSelect": 1,
					"name": "chargeType",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "select",
					"values": [
						"Rent",
						"Water"
					]
				},
				{
					"hidden": false,
					"id": "number3507314566",
					"max": null,
					"min": null,
					"name": "itemCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number3928126423",
					"max": null,
					"min": null,
					"name": "billCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json3225882586",
					"maxSize": 1,
					"name": "totalAmount",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2985344994",
					"maxSize": 1,
					"name": "avgAmount",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json460301526",
					"maxSize": 1,
					"name": "percentageOfTotal",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_3480312777",
			"indexes": [],
			"listRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\"",
			"name": "bill_item_analysis_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  bi.chargeType as id,\n  bi.chargeType,\n  COUNT(bi.id) as itemCount,\n  COUNT(DISTINCT bi.bill) as billCount,\n  (ROUND(SUM(bi.amount), 2)) as totalAmount,\n  (ROUND(AVG(bi.amount), 2)) as avgAmount,\n  (ROUND(SUM(bi.amount) * 100.0 / (SELECT SUM(amount) FROM bill_items), 2)) as percentageOfTotal\nFROM bill_items bi\nGROUP BY bi.chargeType\nORDER BY totalAmount DESC;",
			"viewRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
