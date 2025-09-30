package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1758465380")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" || @request.auth.role = \"Building Admin\"",
			"listRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" || @request.auth.role = \"Building Admin\" ||(@request.auth.role = \"Tenant\" && @request.auth.id = tenant.user.id)",
			"updateRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" || @request.auth.role = \"Building Admin\"",
			"viewRule": "@request.auth.isActive = true && @request.auth.role = \"Administrator\" || @request.auth.role = \"Building Admin\" || (@request.auth.role = \"Tenant\" && @request.auth.id = tenant.user.id)"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_1758465380")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"createRule": "@request.auth.role = \"Administrator\" || @request.auth.role = \"Building Admin\"",
			"listRule": "@request.auth.role = \"Administrator\" || @request.auth.role = \"Building Admin\" ||(@request.auth.role = \"Tenant\" && @request.auth.id = tenant.user.id)",
			"updateRule": "@request.auth.role = \"Administrator\" || @request.auth.role = \"Building Admin\"",
			"viewRule": "@request.auth.role = \"Administrator\" || @request.auth.role = \"Building Admin\" || (@request.auth.role = \"Tenant\" && @request.auth.id = tenant.user.id)"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
