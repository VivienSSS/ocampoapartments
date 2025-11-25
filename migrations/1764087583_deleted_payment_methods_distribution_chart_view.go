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
					"id": "_clone_rd1P",
					"maxSelect": 1,
					"name": "paymentMethod",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "select",
					"values": [
						"GCash"
					]
				},
				{
					"hidden": false,
					"id": "number952011785",
					"max": null,
					"min": null,
					"name": "paymentCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json995426740",
					"maxSize": 1,
					"name": "totalAmountPaid",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1582489305",
					"maxSize": 1,
					"name": "avgPaymentAmount",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json3795912679",
					"maxSize": 1,
					"name": "paymentMethodPercentage",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1121552745",
			"indexes": [],
			"listRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\"",
			"name": "payment_methods_distribution_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  p.paymentMethod as id,\n  p.paymentMethod,\n  COUNT(p.id) as paymentCount,\n  (ROUND(SUM(p.amountPaid), 2)) as totalAmountPaid,\n  (ROUND(AVG(p.amountPaid), 2)) as avgPaymentAmount,\n  (ROUND(COUNT(p.id) * 100.0 / (SELECT COUNT(*) FROM payments), 2)) as paymentMethodPercentage\nFROM payments p\nGROUP BY p.paymentMethod\nORDER BY totalAmountPaid DESC;",
			"viewRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
