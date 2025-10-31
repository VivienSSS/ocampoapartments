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
					"id": "_clone_8VoW",
					"maxSelect": 1,
					"name": "status",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "select",
					"values": [
						"Pending",
						"Acknowledged",
						"Completed"
					]
				},
				{
					"hidden": false,
					"id": "number44561416",
					"max": null,
					"min": null,
					"name": "totalRequests",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number861648443",
					"max": null,
					"min": null,
					"name": "pendingCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json3754731180",
					"maxSize": 1,
					"name": "avgResolutionDays",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_3353987061",
			"indexes": [],
			"listRule": null,
			"name": "maintenance_request_status_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  mr.status as id,\n  mr.status,\n  COUNT(mr.id) as totalRequests,\n  COUNT(CASE WHEN mr.submittedDate IS NOT NULL AND mr.completedDate IS NULL THEN 1 END) as pendingCount,\n  (ROUND(AVG(CASE WHEN mr.completedDate IS NOT NULL \n    THEN (julianday(mr.completedDate) - julianday(mr.submittedDate))\n    ELSE NULL \n  END), 2)) as avgResolutionDays\nFROM maintenance_requests mr\nGROUP BY mr.status\nORDER BY mr.status;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3353987061")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
