package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"oauth2": {
				"mappedFields": {
					"avatarURL": "",
					"name": ""
				}
			}
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("file376926767")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text596812118",
			"max": 0,
			"min": 0,
			"name": "firstName",
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
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text2434144904",
			"max": 0,
			"min": 0,
			"name": "lastName",
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
			"hidden": false,
			"id": "select1466534506",
			"maxSelect": 1,
			"name": "role",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Administrator",
				"Building Admin",
				"Tenant"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(5, []byte(`{
			"hidden": false,
			"id": "bool2323052248",
			"name": "isActive",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "bool"
		}`)); err != nil {
			return err
		}

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text1579384326",
			"max": 255,
			"min": 0,
			"name": "username",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("_pb_users_auth_")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"oauth2": {
				"mappedFields": {
					"avatarURL": "avatar",
					"name": "name"
				}
			}
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
			"hidden": false,
			"id": "file376926767",
			"maxSelect": 1,
			"maxSize": 0,
			"mimeTypes": [
				"image/jpeg",
				"image/png",
				"image/svg+xml",
				"image/gif",
				"image/webp"
			],
			"name": "avatar",
			"presentable": false,
			"protected": false,
			"required": false,
			"system": false,
			"thumbs": null,
			"type": "file"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("text596812118")

		// remove field
		collection.Fields.RemoveById("text2434144904")

		// remove field
		collection.Fields.RemoveById("select1466534506")

		// remove field
		collection.Fields.RemoveById("bool2323052248")

		// update field
		if err := collection.Fields.AddMarshaledJSONAt(6, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text1579384326",
			"max": 255,
			"min": 0,
			"name": "name",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": false,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
