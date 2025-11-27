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
					"id": "_clone_sMsq",
					"maxSize": 0,
					"name": "property",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
				},
				{
					"hidden": false,
					"id": "number2516318759",
					"max": null,
					"min": null,
					"name": "unitCount",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json3476551647",
					"maxSize": 1,
					"name": "minPrice",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json693590078",
					"maxSize": 1,
					"name": "maxPrice",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json771841919",
					"maxSize": 1,
					"name": "avgPrice",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json2735765667",
					"maxSize": 1,
					"name": "totalMonthlyPotential",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_3463176926",
			"indexes": [],
			"listRule": null,
			"name": "unit_price_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  ROW_NUMBER()OVER(ORDER BY p.address) as id,\n  p.address as property,\n  COUNT(au.id) as unitCount,\n  MIN(au.price) as minPrice,\n  MAX(au.price) as maxPrice,\n  (ROUND(AVG(au.price), 2)) as avgPrice,\n  (ROUND(SUM(au.price), 2)) as totalMonthlyPotential\nFROM apartment_units au\nLEFT JOIN properties p ON au.property = p.id\nGROUP BY p.address\nORDER BY avgPrice DESC;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3463176926")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
