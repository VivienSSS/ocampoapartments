package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_569422840")
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
					"convertURLs": false,
					"hidden": false,
					"id": "_clone_sIF8",
					"maxSize": 0,
					"name": "address",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "editor"
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
					"id": "json4115432963",
					"maxSize": 1,
					"name": "totalPotentialMonthlyRevenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1341498181",
					"maxSize": 1,
					"name": "currentMonthlyRevenue",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1817249730",
					"maxSize": 1,
					"name": "revenueUtilizationRate",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_569422840",
			"indexes": [],
			"listRule": "",
			"name": "revenue_per_property_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  p.id,\n  p.address,\n  COUNT(DISTINCT au.id) as totalUnits,\n  SUM(au.price) as totalPotentialMonthlyRevenue,\n  SUM(CASE WHEN au.isAvailable = 0 THEN au.price ELSE 0 END) as currentMonthlyRevenue,\n  (ROUND(SUM(CASE WHEN au.isAvailable = 0 THEN au.price ELSE 0 END) * 100.0 / SUM(au.price), 2)) as revenueUtilizationRate\nFROM properties p\nLEFT JOIN apartment_units au ON p.id = au.property\nGROUP BY p.id, p.address\nORDER BY currentMonthlyRevenue DESC;",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
