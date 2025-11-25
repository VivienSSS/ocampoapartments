package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1249462780")
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
					"id": "_clone_4HmA",
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
					"id": "_clone_dgFq",
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
					"id": "_clone_Gsaf",
					"name": "email",
					"onlyDomains": null,
					"presentable": false,
					"required": true,
					"system": true,
					"type": "email"
				},
				{
					"hidden": false,
					"id": "_clone_q6AP",
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
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_RUSQ",
					"max": 0,
					"min": 0,
					"name": "unitLetter",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"convertURLs": false,
					"hidden": false,
					"id": "_clone_qyFU",
					"maxSize": 0,
					"name": "property",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "number1877072349",
					"max": null,
					"min": null,
					"name": "unpaidBills",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json8603684",
					"maxSize": 1,
					"name": "totalOutstanding",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json4043862681",
					"maxSize": 1,
					"name": "mostRecentDueDate",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2326178985",
					"maxSize": 1,
					"name": "urgencyLevel",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1249462780",
			"indexes": [],
			"listRule": null,
			"name": "outstanding_receivables_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  tn.id,\n  u.firstName,\n  u.lastName,\n  u.email,\n  tn.phoneNumber,\n  au.unitLetter,\n  p.address as property,\n  COUNT(b.id) as unpaidBills,\n  (ROUND(SUM(bi.amount), 2)) as totalOutstanding,\n  MAX(b.dueDate) as mostRecentDueDate,\n  (CASE \n    WHEN MAX(b.dueDate) < date('now') THEN 'OVERDUE'\n    WHEN MAX(b.dueDate) < date('now', '+7 days') THEN 'DUE SOON'\n    ELSE 'UPCOMING'\n  END) as urgencyLevel\nFROM bills b\nLEFT JOIN tenancies t ON b.tenancy = t.id\nLEFT JOIN tenants tn ON t.tenant = tn.id\nLEFT JOIN users u ON tn.user = u.id\nLEFT JOIN apartment_units au ON t.unit = au.id\nLEFT JOIN properties p ON au.property = p.id\nLEFT JOIN bill_items bi ON b.id = bi.bill\nWHERE b.status IN ('pending', 'overdue')\nGROUP BY tn.id, u.firstName, u.lastName, u.email, tn.phoneNumber, au.unitLetter, p.address\nORDER BY totalOutstanding DESC;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
