package migrations

import (
	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3412753434")
		if err != nil {
			return err
		}

		// add field status (select: pending|verified|approved|rejected, default pending)
		if err := collection.Fields.AddMarshaledJSONAt(11, []byte(`{
			"default": "pending",
			"hidden": false,
			"id": "select1466534507",
			"maxSelect": 1,
			"name": "status",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"pending",
				"verified",
				"approved",
				"rejected"
			]
		}`)); err != nil {
			return err
		}

		// add field emailVerified (bool, default false)
		if err := collection.Fields.AddMarshaledJSONAt(12, []byte(`{
			"default": false,
			"hidden": false,
			"id": "bool2323052249",
			"name": "emailVerified",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "bool"
		}`)); err != nil {
			return err
		}

		// add field verifiedAt (date)
		if err := collection.Fields.AddMarshaledJSONAt(13, []byte(`{
			"hidden": false,
			"id": "date2704281782",
			"name": "verifiedAt",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		// add field rejectionReason (text)
		if err := collection.Fields.AddMarshaledJSONAt(14, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "text2292480428",
			"max": 0,
			"min": 0,
			"name": "rejectionReason",
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
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3412753434")
		if err != nil {
			return err
		}

		// remove field status
		collection.Fields.RemoveById("select1466534507")

		// remove field emailVerified
		collection.Fields.RemoveById("bool2323052249")

		// remove field verifiedAt
		collection.Fields.RemoveById("date2704281782")

		// remove field rejectionReason
		collection.Fields.RemoveById("text2292480428")

		return app.Save(collection)
	})
}
