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
					"autogeneratePattern": "[a-z0-9]{15}",
					"hidden": false,
					"id": "text3208210256",
					"max": 15,
					"min": 15,
					"name": "id",
					"pattern": "^[a-z0-9]+$",
					"presentable": false,
					"primaryKey": true,
					"required": true,
					"system": true,
					"type": "text"
				},
				{
					"cascadeDelete": true,
					"collectionId": "pbc_3412753434",
					"hidden": false,
					"id": "relation3639029304",
					"maxSelect": 1,
					"minSelect": 1,
					"name": "inquiry",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "relation"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text2292480427",
					"max": 0,
					"min": 6,
					"name": "code",
					"pattern": "^\\d{6}$",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "date2704281779",
					"name": "expiresAt",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "date"
				},
				{
					"default": false,
					"hidden": false,
					"id": "bool3051925877",
					"name": "hasSent",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "bool"
				},
				{
					"hidden": false,
					"id": "date2704281780",
					"name": "sentAt",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "date"
				},
				{
					"hidden": false,
					"id": "date2704281781",
					"name": "verifiedAt",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "date"
				},
				{
					"default": 0,
					"hidden": false,
					"id": "number3419801611",
					"max": null,
					"min": 0,
					"name": "attemptCount",
					"onlyInt": true,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "autodate2990389176",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "autodate3332085495",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				}
			],
			"id": "pbc_3412753435",
			"indexes": [
				"CREATE UNIQUE INDEX idx_otp_inquiry ON otp (inquiry)"
			],
			"listRule": null,
			"name": "otp",
			"system": false,
			"type": "base",
			"updateRule": null,
			"viewRule": null
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3412753435")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
