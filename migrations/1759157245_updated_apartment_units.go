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
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_CKLv5kWm0f` + "`" + ` ON ` + "`" + `apartment_units` + "`" + ` (` + "`" + `unitLetter` + "`" + `)",
				"CREATE UNIQUE INDEX ` + "`" + `idx_Ya60Hjezi9` + "`" + ` ON ` + "`" + `apartment_units` + "`" + ` (` + "`" + `floorNumber` + "`" + `)",
				"CREATE UNIQUE INDEX ` + "`" + `idx_JJvGcrv9Mb` + "`" + ` ON ` + "`" + `apartment_units` + "`" + ` (\n  ` + "`" + `unitLetter` + "`" + `,\n  ` + "`" + `floorNumber` + "`" + `\n)"
			]
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
			"indexes": [
				"CREATE UNIQUE INDEX ` + "`" + `idx_CKLv5kWm0f` + "`" + ` ON ` + "`" + `apartment_units` + "`" + ` (` + "`" + `unitLetter` + "`" + `)",
				"CREATE UNIQUE INDEX ` + "`" + `idx_Ya60Hjezi9` + "`" + ` ON ` + "`" + `apartment_units` + "`" + ` (` + "`" + `floorNumber` + "`" + `)"
			]
		}`), &collection); err != nil {
			return err
		}

		return app.Save(collection)
	})
}
