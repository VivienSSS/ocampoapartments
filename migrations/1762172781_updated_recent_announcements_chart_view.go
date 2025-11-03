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

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT \n  a.id,\n  a.title,\n  SUBSTR(a.message, 1, 100) as messagePreview,\n  (u.firstName || ' ' || u.lastName) as authorName,\n  u.email,\n  a.created,\n  a.updated,\n  (CASE \n    WHEN a.created >= date('now', '-1 day') THEN 'Today/Yesterday'\n    WHEN a.created >= date('now', '-7 days') THEN 'This Week'\n    WHEN a.created >= date('now', '-30 days') THEN 'This Month'\n    ELSE 'Older'\n  END) as recency\nFROM announcements a\nLEFT JOIN users u ON a.author = u.id\nORDER BY a.created DESC\nLIMIT 3;"
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_ICKp")

		// remove field
		collection.Fields.RemoveById("_clone_ZUEx")

		// remove field
		collection.Fields.RemoveById("_clone_OhFN")

		// remove field
		collection.Fields.RemoveById("_clone_YE5D")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_b3rh",
			"max": 0,
			"min": 0,
			"name": "title",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"exceptDomains": null,
			"hidden": false,
			"id": "_clone_iFwe",
			"name": "email",
			"onlyDomains": null,
			"presentable": false,
			"required": true,
			"system": true,
			"type": "email"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "_clone_ovtO",
			"name": "created",
			"onCreate": true,
			"onUpdate": false,
			"presentable": false,
			"system": false,
			"type": "autodate"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "_clone_r2mD",
			"name": "updated",
			"onCreate": true,
			"onUpdate": true,
			"presentable": false,
			"system": false,
			"type": "autodate"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3698950901")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"viewQuery": "SELECT \n  a.id,\n  a.title,\n  SUBSTR(a.message, 1, 100) as messagePreview,\n  (u.firstName || ' ' || u.lastName) as authorName,\n  u.email,\n  a.created,\n  a.updated,\n  (CASE \n    WHEN a.created >= date('now', '-1 day') THEN 'Today/Yesterday'\n    WHEN a.created >= date('now', '-7 days') THEN 'This Week'\n    WHEN a.created >= date('now', '-30 days') THEN 'This Month'\n    ELSE 'Older'\n  END) as recency\nFROM announcements a\nLEFT JOIN users u ON a.author = u.id\nORDER BY a.created DESC\nLIMIT 50;"
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_ICKp",
			"max": 0,
			"min": 0,
			"name": "title",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"exceptDomains": null,
			"hidden": false,
			"id": "_clone_ZUEx",
			"name": "email",
			"onlyDomains": null,
			"presentable": false,
			"required": true,
			"system": true,
			"type": "email"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "_clone_OhFN",
			"name": "created",
			"onCreate": true,
			"onUpdate": false,
			"presentable": false,
			"system": false,
			"type": "autodate"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"hidden": false,
			"id": "_clone_YE5D",
			"name": "updated",
			"onCreate": true,
			"onUpdate": true,
			"presentable": false,
			"system": false,
			"type": "autodate"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_b3rh")

		// remove field
		collection.Fields.RemoveById("_clone_iFwe")

		// remove field
		collection.Fields.RemoveById("_clone_ovtO")

		// remove field
		collection.Fields.RemoveById("_clone_r2mD")

		return app.Save(collection)
	})
}
