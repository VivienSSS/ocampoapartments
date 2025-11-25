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
					"id": "_clone_af47",
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
					"id": "number4150560450",
					"max": null,
					"min": null,
					"name": "tenanciesAffected",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number4008565406",
					"max": null,
					"min": null,
					"name": "overdueCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				}
			],
			"id": "pbc_3813771158",
			"indexes": [],
			"listRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\"",
			"name": "bills_by_status_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  b.status as id,\n  b.status,\n  COUNT(b.id) as billCount,\n  (ROUND(SUM(bi.amount), 2)) as totalAmount,\n  (ROUND(AVG(bi.amount), 2)) as avgAmount,\n  COUNT(DISTINCT b.tenancy) as tenanciesAffected,\n  COUNT(DISTINCT CASE WHEN b.dueDate < date('now') THEN b.id END) as overdueCount\nFROM bills b\nLEFT JOIN bill_items bi ON b.id = bi.bill\nGROUP BY b.status\nORDER BY billCount DESC;",
			"viewRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
