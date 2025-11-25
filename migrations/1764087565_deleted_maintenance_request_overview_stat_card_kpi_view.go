package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1771966661")
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
					"id": "_clone_KceW",
					"maxSelect": 1,
					"name": "status",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "select",
					"values": [
						"Pending",
						"Worker Assigned",
						"In Progress",
						"Completed"
					]
				},
				{
					"hidden": false,
					"id": "_clone_AZfI",
					"maxSelect": 1,
					"name": "urgency",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "select",
					"values": [
						"Urgent",
						"Normal",
						"Low"
					]
				},
				{
					"hidden": false,
					"id": "number1721384071",
					"max": null,
					"min": null,
					"name": "requestCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number4031111556",
					"max": null,
					"min": null,
					"name": "assignedCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json3939895362",
					"maxSize": 1,
					"name": "assignmentRate",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1791578382",
					"maxSize": 1,
					"name": "avgCompletionDays",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1771966661",
			"indexes": [],
			"listRule": "@request.auth.role = \"Building Admin\"",
			"name": "maintenance_request_overview_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  (mr.status || '_' || mr.urgency) as id,\n  mr.status,\n  mr.urgency,\n  COUNT(mr.id) as requestCount,\n  COUNT(CASE WHEN mr.worker IS NOT NULL THEN 1 END) as assignedCount,\n  (ROUND(COUNT(CASE WHEN mr.worker IS NOT NULL THEN 1 END) * 100.0 / COUNT(mr.id), 2)) as assignmentRate,\n  (ROUND(AVG((julianday(mr.completedDate) - julianday(mr.submittedDate))), 2)) as avgCompletionDays\nFROM maintenance_requests mr\nGROUP BY mr.status, mr.urgency\nORDER BY requestCount DESC;",
			"viewRule": "@request.auth.role = \"Building Admin\""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
