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
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_L3rF",
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
					"id": "_clone_Pzkk",
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
					"hidden": false,
					"id": "_clone_Hi3s",
					"max": null,
					"min": null,
					"name": "capacity",
					"onlyInt": false,
					"presentable": false,
					"required": true,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "_clone_CcKO",
					"max": null,
					"min": null,
					"name": "price",
					"onlyInt": false,
					"presentable": false,
					"required": true,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "_clone_A5gP",
					"name": "isAvailable",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "bool"
				},
				{
					"hidden": false,
					"id": "json2063623452",
					"maxSize": 1,
					"name": "status",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"convertURLs": false,
					"hidden": false,
					"id": "_clone_aO8l",
					"maxSize": 0,
					"name": "propertyAddress",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "_clone_JkY1",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "_clone_OyTr",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			],
			"id": "pbc_2185060045",
			"indexes": [],
			"listRule": null,
			"name": "unit_inventory_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  au.id,\n  au.unitLetter,\n  au.floorNumber,\n  au.capacity,\n  au.price,\n  au.isAvailable,\n  (CASE WHEN au.isAvailable = 1 THEN 'Available' ELSE 'Occupied' END) as status,\n  p.address as propertyAddress,\n  au.created,\n  au.updated\nFROM apartment_units au\nLEFT JOIN properties p ON au.property = p.id\nORDER BY p.address, au.floorNumber, au.unitLetter;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2185060045")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
