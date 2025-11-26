package interceptor

import "github.com/pocketbase/pocketbase/core"

func AddAuthorToAnnouncements(e *core.RecordRequestEvent) error {
	e.Record.Set("author",e.Auth.Id)
	return e.Next()
}