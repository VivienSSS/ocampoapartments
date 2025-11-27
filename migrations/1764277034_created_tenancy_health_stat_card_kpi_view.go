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
					"hidden": false,
					"id": "number4003815923",
					"max": null,
					"min": null,
					"name": "total_tenancies",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number1156275921",
					"max": null,
					"min": null,
					"name": "active_tenancies",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number2956537679",
					"max": null,
					"min": null,
					"name": "expired_tenancies",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "number4204404055",
					"max": null,
					"min": null,
					"name": "expiring_soon",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "json3837327589",
					"maxSize": 1,
					"name": "avg_lease_duration_years",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_2940247555",
			"indexes": [],
			"listRule": null,
			"name": "tenancy_health_stat_card_kpi_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  1 as id,\n  COUNT(*) as total_tenancies,\n  COUNT(CASE WHEN t.leaseEndDate >= date('now') THEN 1 END) as active_tenancies,\n  COUNT(CASE WHEN t.leaseEndDate < date('now') THEN 1 END) as expired_tenancies,\n  COUNT(CASE WHEN t.leaseEndDate < date('now', '+30 days') AND t.leaseEndDate >= date('now') THEN 1 END) as expiring_soon,\n  ROUND(AVG((julianday(t.leaseEndDate) - julianday(t.leaseStartDate)) / 365.25), 2) as avg_lease_duration_years\nFROM tenancies t;",
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_2940247555")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
