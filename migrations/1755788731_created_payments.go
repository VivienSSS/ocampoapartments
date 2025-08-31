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
					"cascadeDelete": false,
					"collectionId": "pbc_3912360763",
					"hidden": false,
					"id": "relation2048989667",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "bill",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "relation"
				},
				{
					"cascadeDelete": false,
					"collectionId": "pbc_699394385",
					"hidden": false,
					"id": "relation1314505826",
					"maxSelect": 1,
					"minSelect": 0,
					"name": "tenant",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "relation"
				},
				{
					"hidden": false,
					"id": "select2223302008",
					"maxSelect": 1,
					"name": "paymentMethod",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "select",
					"values": [
						"Over the counter",
						"GCash"
					]
				},
				{
					"hidden": false,
					"id": "number2236407663",
					"max": null,
					"min": null,
					"name": "amountPaid",
					"onlyInt": false,
					"presentable": false,
					"required": false,
					"system": false,
					"type": "number"
				},
				{
					"hidden": false,
					"id": "date1889812618",
					"max": "",
					"min": "",
					"name": "paymentDate",
					"presentable": false,
					"required": true,
					"system": false,
					"type": "date"
				},
				{
					"autogeneratePattern": "",
					"hidden": false,
					"id": "text3270783252",
					"max": 0,
					"min": 0,
					"name": "transactionId",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "file1486429761",
					"maxSelect": 1,
					"maxSize": 0,
					"mimeTypes": [],
					"name": "screenshot",
					"presentable": false,
					"protected": false,
					"required": true,
					"system": false,
					"thumbs": [],
					"type": "file"
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
			"id": "pbc_631030571",
			"indexes": [],
			"listRule": null,
			"name": "payments",
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
		collection, err := app.FindCollectionByNameOrId("pbc_631030571")
		if err != nil {
			return err
		}

		return app.Delete(collection)
	})
}
