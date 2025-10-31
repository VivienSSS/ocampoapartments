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
					"id": "_clone_mE4t",
					"maxSize": 0,
					"name": "address",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "number1181117362",
					"max": null,
					"min": null,
					"name": "totalTenants",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
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
					"id": "json2096245025",
					"maxSize": 1,
					"name": "occupancyPercentage",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_2634964219",
			"indexes": [],
			"listRule": null,
			"name": "tenants_per_proeprty_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  p.id,\n  p.address,\n  COUNT(DISTINCT t.id) as totalTenants,\n  COUNT(DISTINCT au.id) as totalUnits,\n  (ROUND(COUNT(DISTINCT t.id) * 100.0 / COUNT(DISTINCT au.id), 2)) as occupancyPercentage\nFROM properties p\nLEFT JOIN apartment_units au ON p.id = au.property\nLEFT JOIN tenancies t ON au.id = t.unit AND t.leaseEndDate >= date('now')\nGROUP BY p.id, p.address\nORDER BY occupancyPercentage DESC;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2634964219")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
