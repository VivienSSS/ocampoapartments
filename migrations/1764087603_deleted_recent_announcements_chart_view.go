package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3698950901")
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
					"autogeneratePattern": "",
					"hidden": false,
					"id": "_clone_NB7I",
					"max": 0,
					"min": 0,
					"name": "title",
					"pattern": "",
					"presentable": false,
					"primaryKey": false,
					"required": true,
					"system": false,
					"type": "text"
				},
				{
					"hidden": false,
					"id": "json3089919008",
					"maxSize": 1,
					"name": "messagePreview",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"hidden": false,
					"id": "json1379736654",
					"maxSize": 1,
					"name": "authorName",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				},
				{
					"exceptDomains": null,
					"hidden": false,
					"id": "_clone_iskA",
					"name": "email",
					"onlyDomains": null,
					"presentable": false,
					"required": true,
					"system": true,
					"type": "email"
				},
				{
					"hidden": false,
					"id": "_clone_fN9k",
					"name": "created",
					"onCreate": true,
					"onUpdate": false,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "_clone_9jvL",
					"name": "updated",
					"onCreate": true,
					"onUpdate": true,
					"presentable": false,
					"system": false,
					"type": "autodate"
				},
				{
					"hidden": false,
					"id": "json1233690095",
					"maxSize": 1,
					"name": "recency",
					"presentable": false,
					"required": false,
					"system": false,
					"type": "json"
				}
			],
			"id": "pbc_3698950901",
			"indexes": [],
			"listRule": "",
			"name": "recent_announcements_chart_view",
			"system": false,
			"type": "view",
			"updateRule": null,
			"viewQuery": "SELECT \n  a.id,\n  a.title,\n  SUBSTR(a.message, 1, 100) as messagePreview,\n  (u.firstName || ' ' || u.lastName) as authorName,\n  u.email,\n  a.created,\n  a.updated,\n  (CASE \n    WHEN a.created >= date('now', '-1 day') THEN 'Today/Yesterday'\n    WHEN a.created >= date('now', '-7 days') THEN 'This Week'\n    WHEN a.created >= date('now', '-30 days') THEN 'This Month'\n    ELSE 'Older'\n  END) as recency\nFROM announcements a\nLEFT JOIN users u ON a.author = u.id\nORDER BY a.created DESC\nLIMIT 3;",
			"viewRule": ""
		}`

		collection := &core.Collection{}
		if err := json.Unmarshal([]byte(jsonData), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
