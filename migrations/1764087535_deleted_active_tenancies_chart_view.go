package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3386328386")
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
					"id": "_clone_T8jk",
					"max": 255,
					"min": 0,
					"name": "tenantUsername",
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
					"id": "_clone_kA6K",
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
					"id": "_clone_Y0nE",
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
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_eBN4",
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
					"hidden": false,
					"id": "_clone_h4Lh",
					"max": null,
					"min": null,
					"name": "floorNumber",
					"onlyInt": false,
					"presentable": false,
					"required": true,
					"system": false,
					"type": "number"
				},
				{
					"convertURLs": false,
					"hidden": false,
					"id": "_clone_4gbv",
					"maxSize": 0,
					"name": "property",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "_clone_thba",
					"max": "",
					"min": "",
					"name": "leaseStartDate",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "date"
				},
				{
					"hidden": false,
					"id": "_clone_R008",
					"max": "",
					"min": "",
					"name": "leaseEndDate",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "date"
				},
				{
					"hidden": false,
					"id": "json2074139512",
					"maxSize": 1,
					"name": "leaseStatus",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "_clone_hGfq",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "_clone_4Qzp",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			],
			"id": "pbc_3386328386",
			"indexes": [],
			"listRule": "",
			"name": "active_tenancies_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  t.id,\n  tn.id as tenantId,\n  u.username as tenantUsername,\n  u.firstName,\n  u.lastName,\n  au.unitLetter,\n  au.floorNumber,\n  p.address as property,\n  t.leaseStartDate,\n  t.leaseEndDate,\n  (CASE \n    WHEN t.leaseEndDate < date('now') THEN 'Expired'\n    WHEN t.leaseEndDate < date('now', '+30 days') THEN 'Expiring Soon'\n    ELSE 'Active'\n  END) as leaseStatus,\n  t.created,\n  t.updated\nFROM tenancies t\nLEFT JOIN tenants tn ON t.tenant = tn.id\nLEFT JOIN users u ON tn.user = u.id\nLEFT JOIN apartment_units au ON t.unit = au.id\nLEFT JOIN properties p ON au.property = p.id\nORDER BY t.leaseEndDate;",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
