package interceptor

import (
	"github.com/pocketbase/pocketbase/core"
)

func AddAuthorToAnnouncements(e *core.RecordRequestEvent) error {
	e.Record.Set("author",e.Auth.Id)
	return e.Next()
}

func SendAnnouncementsToEmails(e *core.RecordEvent) error {

	// store the announcements via email
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")

	if err != nil {
		return err
	}

	// get all of the tenants in the system
	userRecords, err := e.App.FindRecordsByFilter("users", "role = 'Tenant'","",99,0)

	if err != nil {
		return err
	}


	// interate over the tenants and send them the announcements
	for _,record := range userRecords {
	
		newEmailRecord := core.NewRecord(emailCollection)
		newEmailRecord.Set("to",record.Get("email"))
		newEmailRecord.Set("message",e.Record.Get("message"))

		e.App.Save(newEmailRecord)
	}

	return e.Next()
}