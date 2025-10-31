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
					"id": "_clone_e2pB",
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
					"id": "_clone_xy9J",
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
					"id": "_clone_iGC0",
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
					"id": "_clone_aGSA",
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
					"id": "_clone_Zx9u",
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
					"id": "_clone_zLqO",
					"maxSize": 0,
					"name": "property",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "_clone_qk4H",
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
					"id": "_clone_FnS5",
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
					"id": "_clone_9ZbG",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "_clone_TpdA",
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
			"listRule": null,
			"name": "active_tenancies_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  t.id,\n  tn.id as tenantId,\n  u.username as tenantUsername,\n  u.firstName,\n  u.lastName,\n  au.unitLetter,\n  au.floorNumber,\n  p.address as property,\n  t.leaseStartDate,\n  t.leaseEndDate,\n  (CASE \n    WHEN t.leaseEndDate < date('now') THEN 'Expired'\n    WHEN t.leaseEndDate < date('now', '+30 days') THEN 'Expiring Soon'\n    ELSE 'Active'\n  END) as leaseStatus,\n  t.created,\n  t.updated\nFROM tenancies t\nLEFT JOIN tenants tn ON t.tenant = tn.id\nLEFT JOIN users u ON tn.user = u.id\nLEFT JOIN apartment_units au ON t.unit = au.id\nLEFT JOIN properties p ON au.property = p.id\nORDER BY t.leaseEndDate;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3386328386")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
