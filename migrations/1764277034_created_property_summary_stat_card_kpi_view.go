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
					"id": "_clone_ob7g",
					"maxSize": 0,
					"name": "address",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "_clone_1hnI",
					"maxSelect": 1,
					"name": "branch",
					"presentable": true,
					"required": true,
					"system": false,
					"type": "select",
					"values": [
						"Quezon City",
						"Pampanga"
					]
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
					"id": "json2858942188",
					"maxSize": 1,
					"name": "availableUnits",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1003664367",
					"maxSize": 1,
					"name": "occupiedUnits",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
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
					"id": "_clone_i439",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "_clone_aKX3",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			],
			"id": "pbc_1395653745",
			"indexes": [],
			"listRule": null,
			"name": "property_summary_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  p.id,\n  p.address,\n  p.branch,\n  COUNT(au.id) as totalUnits,\n  SUM(CASE WHEN au.isAvailable = 1 THEN 1 ELSE 0 END) as availableUnits,\n  SUM(CASE WHEN au.isAvailable = 0 THEN 1 ELSE 0 END) as occupiedUnits,\n  (ROUND(SUM(CASE WHEN au.isAvailable = 0 THEN 1 ELSE 0 END) * 100.0 / COUNT(au.id), 2)) as occupancyRate,\n  p.created,\n  p.updated\nFROM properties p\nLEFT JOIN apartment_units au ON p.id = au.property\nGROUP BY p.id, p.address, p.branch\nORDER BY p.address;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1395653745")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
