package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3427628")
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
					"convertURLs": false,
					"hidden": false,
					"id": "_clone_beZE",
					"maxSize": 0,
					"name": "address",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "number189577387",
					"max": null,
					"min": null,
					"name": "totalUnits",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number1003664367",
					"max": null,
					"min": null,
					"name": "occupiedUnits",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json3007229421",
					"maxSize": 1,
					"name": "occupancyRate",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2735765667",
					"maxSize": 1,
					"name": "totalMonthlyPotential",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
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
					"id": "number3335112896",
					"max": null,
					"min": null,
					"name": "outstandingBills",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json2482167475",
					"maxSize": 1,
					"name": "outstandingAmount",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "number1134488260",
					"max": null,
					"min": null,
					"name": "openMaintenanceRequests",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number1371877608",
					"max": null,
					"min": null,
					"name": "highPriorityRequests",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				}
			],
			"id": "pbc_3427628",
			"indexes": [],
			"listRule": "@request.auth.role = \"Administrator\"",
			"name": "property_health_dashboard_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  p.id,\n  p.address,\n  COUNT(DISTINCT au.id) as totalUnits,\n  COUNT(DISTINCT CASE WHEN au.isAvailable = 0 THEN au.id END) as occupiedUnits,\n  (ROUND(COUNT(DISTINCT CASE WHEN au.isAvailable = 0 THEN au.id END) * 100.0 / COUNT(DISTINCT au.id), 2)) as occupancyRate,\n  (ROUND(SUM(au.price), 2)) as totalMonthlyPotential,\n  COUNT(DISTINCT b.id) as totalBills,\n  COUNT(DISTINCT CASE WHEN b.status IN ('pending', 'overdue') THEN b.id END) as outstandingBills,\n  (ROUND(SUM(CASE WHEN b.status IN ('pending', 'overdue') THEN bi.amount ELSE 0 END), 2)) as outstandingAmount,\n  COUNT(DISTINCT mr.id) as openMaintenanceRequests,\n  COUNT(DISTINCT CASE WHEN mr.urgency IN ('critical', 'high') THEN mr.id END) as highPriorityRequests\nFROM properties p\nLEFT JOIN apartment_units au ON p.id = au.property\nLEFT JOIN tenancies t ON au.id = t.unit AND t.leaseEndDate >= date('now')\nLEFT JOIN bills b ON t.id = b.tenancy\nLEFT JOIN bill_items bi ON b.id = bi.bill\nLEFT JOIN maintenance_requests mr ON au.id = mr.unit AND mr.status != 'completed'\nGROUP BY p.id, p.address\nORDER BY p.address;",
			"viewRule": "@request.auth.role = \"Administrator\""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
