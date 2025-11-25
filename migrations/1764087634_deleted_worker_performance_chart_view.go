package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3518999061")
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
					"id": "_clone_ecnv",
					"max": 0,
					"min": 0,
					"name": "name",
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
					"id": "_clone_t6Ag",
					"maxSize": 0,
					"name": "contactDetails",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "_clone_hAC0",
					"name": "isAvailable",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "bool"
				},
				{
					"hidden": false,
					"id": "number557138527",
					"max": null,
					"min": null,
					"name": "totalAssignments",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number2895587096",
					"max": null,
					"min": null,
					"name": "completedJobs",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number2820985046",
					"max": null,
					"min": null,
					"name": "inProgressJobs",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json712666810",
					"maxSize": 1,
					"name": "completionRate",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
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
			"id": "pbc_3518999061",
			"indexes": [],
			"listRule": null,
			"name": "worker_performance_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  mw.id,\n  mw.name,\n  mw.contactDetails,\n  mw.isAvailable,\n  COUNT(mr.id) as totalAssignments,\n  COUNT(CASE WHEN mr.status = 'completed' THEN 1 END) as completedJobs,\n  COUNT(CASE WHEN mr.status = 'in_progress' THEN 1 END) as inProgressJobs,\n  (ROUND(COUNT(CASE WHEN mr.status = 'completed' THEN 1 END) * 100.0 / NULLIF(COUNT(mr.id), 0), 2)) as completionRate,\n  (ROUND(AVG(CASE WHEN mr.completedDate IS NOT NULL \n    THEN (julianday(mr.completedDate) - julianday(mr.submittedDate))\n    ELSE NULL \n  END), 2)) as avgResolutionDays\nFROM maintenance_workers mw\nLEFT JOIN maintenance_requests mr ON mw.id = mr.worker\nGROUP BY mw.id, mw.name, mw.contactDetails, mw.isAvailable\nORDER BY totalAssignments DESC;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
