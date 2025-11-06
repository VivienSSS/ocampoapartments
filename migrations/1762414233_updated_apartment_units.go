package migrations

import (
	"encoding/json"

	"github.com/pocketbase/pocketbase/core"
	m "github.com/pocketbase/pocketbase/migrations"
)

func init() {
	m.Register(func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3225143830")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"listRule": "(@request.auth.id = \"\" && isAvailable = true) || @request.auth.id != \"\" ||\n@request.auth.role = \"Administrator\"",
			"viewRule": "(@request.auth.id = \"\" && isAvailable = true) || @request.auth.id != \"\" || @request.auth.role = \"Administrator\""
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	}, func(app core.App) error {
		collection, err := app.FindCollectionByNameOrId("pbc_3225143830")
		if err != nil {
			return err
		}

		// update collection data
		if err := json.Unmarshal([]byte(`{
			"listRule": "(@request.auth.id = \"\" && isAvailable = true) || @request.auth.id != \"\"",
			"viewRule": "(@request.auth.id = \"\" && isAvailable = true) || @request.auth.id != \"\""
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
