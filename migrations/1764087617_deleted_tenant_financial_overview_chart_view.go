package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2768068839")
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
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_4X2Y",
					"max": 255,
					"min": 0,
					"name": "username",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_QxyO",
					"max": 0,
					"min": 0,
					"name": "firstName",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_dwVE",
					"max": 0,
					"min": 0,
					"name": "lastName",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"exceptDomains": null,
					"hidden": false,
					"id": "_clone_hgjE",
					"name": "email",
					"onlyDomains": null,
					"presentable": false,
					"required": true,
					"system": true,
					"type": "email"
				},
				{
					"hidden": false,
					"id": "_clone_dSUr",
					"max": null,
					"min": null,
					"name": "phoneNumber",
					"onlyInt": true,
					"presentable": true,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number4126744801",
					"max": null,
					"min": null,
					"name": "totalUnitsRented",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number3230372146",
					"max": null,
					"min": null,
					"name": "totalBills",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json1280451850",
					"maxSize": 1,
					"name": "totalBilled",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json3107479025",
					"maxSize": 1,
					"name": "totalPaid",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1716752090",
					"maxSize": 1,
					"name": "outstandingBalance",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2952566694",
					"maxSize": 1,
					"name": "paymentRatePercentage",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_2768068839",
			"indexes": [],
			"listRule": null,
			"name": "tenant_financial_overview_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  tn.id,\n  u.username,\n  u.firstName,\n  u.lastName,\n  u.email,\n  tn.phoneNumber,\n  COUNT(DISTINCT t.id) as totalUnitsRented,\n  COUNT(DISTINCT b.id) as totalBills,\n  (ROUND(SUM(bi.amount), 2)) as totalBilled,\n  (ROUND(SUM(CASE WHEN p.amountPaid IS NOT NULL THEN p.amountPaid ELSE 0 END), 2)) as totalPaid,\n  (ROUND(SUM(CASE WHEN b.status IN ('pending', 'overdue') THEN bi.amount ELSE 0 END), 2)) as outstandingBalance,\n  (ROUND(SUM(CASE WHEN p.amountPaid IS NOT NULL THEN p.amountPaid ELSE 0 END) * 100.0 / NULLIF(SUM(bi.amount), 0), 2)) as paymentRatePercentage\nFROM tenants tn\nLEFT JOIN users u ON tn.user = u.id\nLEFT JOIN tenancies t ON tn.id = t.tenant\nLEFT JOIN bills b ON t.id = b.tenancy\nLEFT JOIN bill_items bi ON b.id = bi.bill\nLEFT JOIN payments p ON b.id = p.bill\nGROUP BY tn.id, u.username, u.firstName, u.lastName, u.email, tn.phoneNumber\nORDER BY outstandingBalance DESC;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
