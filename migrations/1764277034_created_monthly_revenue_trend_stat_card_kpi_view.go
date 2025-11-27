package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
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
					"id": "json2394296326",
					"maxSize": 1,
					"name": "month",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
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
					"id": "json1010770257",
					"maxSize": 1,
					"name": "monthlyRevenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1179868391",
					"maxSize": 1,
					"name": "avgPaymentSize",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "number2479630340",
					"max": null,
					"min": null,
					"name": "uniqueTenants",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				}
			],
			"id": "pbc_2044263475",
			"indexes": [],
			"listRule": null,
			"name": "monthly_revenue_trend_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  strftime('%Y-%m', p.paymentDate) as id,\n  strftime('%Y-%m', p.paymentDate) as month,\n  COUNT(p.id) as paymentCount,\n  (ROUND(SUM(p.amountPaid), 2)) as monthlyRevenue,\n  (ROUND(AVG(p.amountPaid), 2)) as avgPaymentSize,\n  COUNT(DISTINCT p.tenant) as uniqueTenants\nFROM payments p\nWHERE p.paymentDate IS NOT NULL\nGROUP BY strftime('%Y-%m', p.paymentDate)\nORDER BY month DESC;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2044263475")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
