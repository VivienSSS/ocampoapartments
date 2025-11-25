package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1318376037")
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
					"id": "number1940610282",
					"max": null,
					"min": null,
					"name": "total_properties",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number717415035",
					"max": null,
					"min": null,
					"name": "total_units",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number1531181561",
					"max": null,
					"min": null,
					"name": "occupied_units",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json1494287826",
					"maxSize": 1,
					"name": "overall_occupancy_rate",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "number1041486495",
					"max": null,
					"min": null,
					"name": "total_active_tenants",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json119494471",
					"maxSize": 1,
					"name": "total_monthly_potential_revenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_1318376037",
			"indexes": [],
			"listRule": "",
			"name": "porfolio_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  1 as id,\n  COUNT(DISTINCT p.id) as total_properties,\n  COUNT(DISTINCT au.id) as total_units,\n  COUNT(DISTINCT CASE WHEN au.isAvailable = 0 THEN au.id END) as occupied_units,\n  ROUND(COUNT(DISTINCT CASE WHEN au.isAvailable = 0 THEN au.id END) * 100.0 / COUNT(DISTINCT au.id), 2) as overall_occupancy_rate,\n  COUNT(DISTINCT t.id) as total_active_tenants,\n  ROUND(SUM(au.price), 2) as total_monthly_potential_revenue\nFROM properties p\nLEFT JOIN apartment_units au ON p.id = au.property\nLEFT JOIN tenancies t ON au.id = t.unit AND t.leaseEndDate >= date('now');",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
