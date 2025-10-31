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
					"convertURLs": false,
					"hidden": false,
					"id": "_clone_seLB",
					"maxSize": 0,
					"name": "description",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "_clone_76Bj",
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
					"id": "_clone_k4B9",
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
					"id": "_clone_uv3t",
					"max": "",
					"min": "",
					"name": "submittedDate",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "date"
				},
				{
					"hidden": false,
					"id": "json1513857582",
					"maxSize": 1,
					"name": "priorityLabel",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_699394385",
					"hidden": false,
					"id": "relation3783197223",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "tenantId",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "relation"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_nNPW",
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
					"id": "_clone_BWqE",
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
					"exceptDomains": [],
					"hidden": false,
					"id": "_clone_OH4h",
					"name": "contactEmail",
					"onlyDomains": [],
					"presentable": false,
					"required": true,
					"system": false,
					"type": "email"
				},
				{
					"hidden": false,
					"id": "_clone_SjRk",
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
					"id": "_clone_cj7r",
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
					"id": "_clone_fOCR",
					"maxSize": 0,
					"name": "property",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_WR6q",
					"max": 0,
					"min": 0,
					"name": "assignedWorker",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "json2870674409",
					"maxSize": 1,
					"name": "daysOpen",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_3228850419",
			"indexes": [],
			"listRule": null,
			"name": "high_priority_unresolved_requests_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  mr.id,\n  mr.description,\n  mr.urgency,\n  mr.status,\n  mr.submittedDate,\n  (CASE \n    WHEN mr.urgency = 'critical' THEN 'CRITICAL - Immediate Action'\n    WHEN mr.urgency = 'high' THEN 'HIGH - Urgent'\n    WHEN mr.urgency = 'medium' THEN 'MEDIUM - Soon'\n    ELSE 'LOW'\n  END) as priorityLabel,\n  tn.id as tenantId,\n  u.firstName,\n  u.lastName,\n  u.contactEmail,\n  tn.phoneNumber,\n  au.unitLetter,\n  p.address as property,\n  mw.name as assignedWorker,\n  (ROUND((julianday('now') - julianday(mr.submittedDate)), 0)) as daysOpen\nFROM maintenance_requests mr\nLEFT JOIN tenants tn ON mr.tenant = tn.id\nLEFT JOIN users u ON tn.user = u.id\nLEFT JOIN apartment_units au ON mr.unit = au.id\nLEFT JOIN properties p ON au.property = p.id\nLEFT JOIN maintenance_workers mw ON mr.worker = mw.id\nWHERE mr.status != 'completed' AND (mr.urgency = 'critical' OR mr.urgency = 'high')\nORDER BY mr.urgency DESC, mr.submittedDate ASC;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3228850419")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
