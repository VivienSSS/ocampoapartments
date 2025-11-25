package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1296557349")
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
					"id": "number3313162976",
					"max": null,
					"min": null,
					"name": "total_requests",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number824016891",
					"max": null,
					"min": null,
					"name": "completed_requests",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number4232452724",
					"max": null,
					"min": null,
					"name": "pending_requests",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number925794453",
					"max": null,
					"min": null,
					"name": "critical_pending",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number1278336178",
					"max": null,
					"min": null,
					"name": "total_workers",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number863721109",
					"max": null,
					"min": null,
					"name": "available_workers",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				}
			],
			"id": "pbc_1296557349",
			"indexes": [],
			"listRule": "",
			"name": "maintenance_operation_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  1 as id,\n  COUNT(DISTINCT mr.id) as total_requests,\n  COUNT(DISTINCT CASE WHEN mr.status = 'completed' THEN mr.id END) as completed_requests,\n  COUNT(DISTINCT CASE WHEN mr.status != 'completed' THEN mr.id END) as pending_requests,\n  COUNT(DISTINCT CASE WHEN mr.urgency IN ('critical', 'high') AND mr.status != 'completed' THEN mr.id END) as critical_pending,\n  COUNT(DISTINCT mw.id) as total_workers,\n  COUNT(DISTINCT CASE WHEN mw.isAvailable = 1 THEN mw.id END) as available_workers\nFROM maintenance_requests mr\nLEFT JOIN maintenance_workers mw ON mr.worker = mw.id OR 1=1;",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
