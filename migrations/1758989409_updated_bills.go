package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3912360763")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"listRule": "@request.auth.role = \"Administrator\" || (@request.auth.role = \"Tenant\" && @request.auth.id = tenancy.tenant.user.id)",
			"viewRule": "@request.auth.role = \"Administrator\" || (@request.auth.role = \"Tenant\" && @request.auth.id = tenancy.tenant.user.id)"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3912360763")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"listRule": "@request.auth.role = \"Administrator\" || (@request.auth.role = \"Tenant\")",
			"viewRule": "@request.auth.role = \"Administrator\" || (@request.auth.role = \"Tenant\")"
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
