package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3228850419")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"listRule": "@request.auth.role = \"Building Admin\"",
			"viewRule": "@request.auth.role = \"Building Admin\""
		}`), &collection); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_cq7t")

		// remove field
		collection.Fields.RemoveById("_clone_tL1Q")

		// remove field
		collection.Fields.RemoveById("_clone_g5zD")

		// remove field
		collection.Fields.RemoveById("_clone_oQgl")

		// remove field
		collection.Fields.RemoveById("_clone_4PcA")

		// remove field
		collection.Fields.RemoveById("_clone_kR5A")

		// remove field
		collection.Fields.RemoveById("_clone_bcJC")

		// remove field
		collection.Fields.RemoveById("_clone_2THd")

		// remove field
		collection.Fields.RemoveById("_clone_oE84")

		// remove field
		collection.Fields.RemoveById("_clone_QrGb")

		// remove field
		collection.Fields.RemoveById("_clone_7o7B")

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "_clone_oEwo",
			"maxSize": 0,
			"name": "description",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "_clone_v5J5",
			"maxSelect": 1,
			"name": "urgency",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Urgent",
				"Normal",
				"Low"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "_clone_NtF2",
			"maxSelect": 1,
			"name": "status",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"Pending",
				"Acknowledged",
				"Completed"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_1ud9",
			"max": "",
			"min": "",
			"name": "submittedDate",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_lWbj",
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
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_LeHE",
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
		if err := collection.Fields.AddMarshaledJSONAt(9, []byte(`{
			"exceptDomains": [],
			"hidden": false,
			"id": "_clone_PFwX",
			"name": "contactEmail",
			"onlyDomains": [],
			"presentable": false,
			"required": true,
			"system": false,
			"type": "email"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(10, []byte(`{
			"hidden": false,
			"id": "_clone_2njY",
			"max": null,
			"min": null,
			"name": "phoneNumber",
			"onlyInt": true,
			"presentable": true,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(11, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_oh7B",
			"max": 0,
			"min": 0,
			"name": "unitLetter",
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
		if err := collection.Fields.AddMarshaledJSONAt(12, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "_clone_0Ofk",
			"maxSize": 0,
			"name": "property",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(13, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_Ww5H",
			"max": 0,
			"min": 0,
			"name": "assignedWorker",
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
		collection, err := app.FindCollectionByNameOrId("pbc_3228850419")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"listRule": null,
			"viewRule": null
		}`), &collection); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(1, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "_clone_cq7t",
			"maxSize": 0,
			"name": "description",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(2, []byte(`{
			"hidden": false,
			"id": "_clone_tL1Q",
			"maxSelect": 1,
			"name": "urgency",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "select",
			"values": [
				"Urgent",
				"Normal",
				"Low"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(3, []byte(`{
			"hidden": false,
			"id": "_clone_g5zD",
			"maxSelect": 1,
			"name": "status",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "select",
			"values": [
				"Pending",
				"Acknowledged",
				"Completed"
			]
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(4, []byte(`{
			"hidden": false,
			"id": "_clone_oQgl",
			"max": "",
			"min": "",
			"name": "submittedDate",
			"presentable": false,
			"required": false,
			"system": false,
			"type": "date"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(7, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_4PcA",
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
		if err := collection.Fields.AddMarshaledJSONAt(8, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_kR5A",
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
		if err := collection.Fields.AddMarshaledJSONAt(9, []byte(`{
			"exceptDomains": [],
			"hidden": false,
			"id": "_clone_bcJC",
			"name": "contactEmail",
			"onlyDomains": [],
			"presentable": false,
			"required": true,
			"system": false,
			"type": "email"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(10, []byte(`{
			"hidden": false,
			"id": "_clone_2THd",
			"max": null,
			"min": null,
			"name": "phoneNumber",
			"onlyInt": true,
			"presentable": true,
			"required": false,
			"system": false,
			"type": "number"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(11, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_oE84",
			"max": 0,
			"min": 0,
			"name": "unitLetter",
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
		if err := collection.Fields.AddMarshaledJSONAt(12, []byte(`{
			"convertURLs": false,
			"hidden": false,
			"id": "_clone_QrGb",
			"maxSize": 0,
			"name": "property",
			"presentable": false,
			"required": true,
			"system": false,
			"type": "editor"
		}`)); err != nil {
			return err
		}

		// add field
		if err := collection.Fields.AddMarshaledJSONAt(13, []byte(`{
			"autogeneratePattern": "",
			"hidden": false,
			"id": "_clone_7o7B",
			"max": 0,
			"min": 0,
			"name": "assignedWorker",
			"pattern": "",
			"presentable": false,
			"primaryKey": false,
			"required": true,
			"system": false,
			"type": "text"
		}`)); err != nil {
			return err
		}

		// remove field
		collection.Fields.RemoveById("_clone_oEwo")

		// remove field
		collection.Fields.RemoveById("_clone_v5J5")

		// remove field
		collection.Fields.RemoveById("_clone_NtF2")

		// remove field
		collection.Fields.RemoveById("_clone_1ud9")

		// remove field
		collection.Fields.RemoveById("_clone_lWbj")

		// remove field
		collection.Fields.RemoveById("_clone_LeHE")

		// remove field
		collection.Fields.RemoveById("_clone_PFwX")

		// remove field
		collection.Fields.RemoveById("_clone_2njY")

		// remove field
		collection.Fields.RemoveById("_clone_oh7B")

		// remove field
		collection.Fields.RemoveById("_clone_0Ofk")

		// remove field
		collection.Fields.RemoveById("_clone_Ww5H")

		return app.Save(collection)
	})
}
