package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1826609301")
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
					"id": "number3775253474",
					"max": null,
					"min": null,
					"name": "total_bills",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number4144741248",
					"max": null,
					"min": null,
					"name": "paid_bills",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number3185762264",
					"max": null,
					"min": null,
					"name": "pending_bills",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number461586131",
					"max": null,
					"min": null,
					"name": "overdue_bills",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json3691711052",
					"maxSize": 1,
					"name": "total_bill_amount",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2207660229",
					"maxSize": 1,
					"name": "total_paid",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1410821822",
					"maxSize": 1,
					"name": "total_outstanding",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2006136182",
					"maxSize": 1,
					"name": "total_received",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2450784116",
					"maxSize": 1,
					"name": "payment_collection_rate",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1826609301",
			"indexes": [],
			"listRule": "",
			"name": "financial_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  1 as id,\n  COUNT(DISTINCT b.id) as total_bills,\n  COUNT(DISTINCT CASE WHEN b.status = 'paid' THEN b.id END) as paid_bills,\n  COUNT(DISTINCT CASE WHEN b.status = 'pending' THEN b.id END) as pending_bills,\n  COUNT(DISTINCT CASE WHEN b.status = 'overdue' THEN b.id END) as overdue_bills,\n  ROUND(SUM(bi.amount), 2) as total_bill_amount,\n  ROUND(SUM(CASE WHEN b.status = 'paid' THEN bi.amount ELSE 0 END), 2) as total_paid,\n  ROUND(SUM(CASE WHEN b.status = 'pending' OR b.status = 'overdue' THEN bi.amount ELSE 0 END), 2) as total_outstanding,\n  ROUND(SUM(CASE WHEN p.amountPaid IS NOT NULL THEN p.amountPaid ELSE 0 END), 2) as total_received,\n  ROUND(SUM(CASE WHEN p.amountPaid IS NOT NULL THEN p.amountPaid ELSE 0 END) * 100.0 / NULLIF(SUM(bi.amount), 0), 2) as payment_collection_rate\nFROM bills b\nLEFT JOIN bill_items bi ON b.id = bi.bill\nLEFT JOIN payments p ON b.id = p.bill;",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
