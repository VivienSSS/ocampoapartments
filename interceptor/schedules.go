package interceptor

import (
	"fmt"

	"github.com/pocketbase/pocketbase/core"
)

func NotifyNewSchedules(e *core.RecordEvent) error {
	// Notify tenant when a new schedule is created
	schedule := e.Record

	// Get the tenant ID (direct relation to users)
	tenantId := schedule.GetString("tenant")
	if tenantId == "" {
		return e.Next()
	}

	// Find the user record to get email
	user, err := e.App.FindRecordById("_pb_users_auth_", tenantId)
	if err != nil {
		return err
	}

	tenantEmail := user.GetString("email")
	if tenantEmail == "" {
		return e.Next()
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for new schedule notification
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "New Schedule Created - Pending Approval")
	emailRecord.Set("message", fmt.Sprintf(`
A new schedule has been created for you.

Schedule Details:
Reason: %s
Date: %s
Message: %s
Status: Pending Approval

Please wait for approval from the management office. You will receive a notification once it has been reviewed.
	`, schedule.GetString("reason"), schedule.GetString("date"), schedule.GetString("message")))

	e.App.Save(emailRecord)

	return e.Next()
}

func NotifyOutdatedSchedules(e *core.RecordEvent) error {
	// Notify tenant when a schedule is cancelled
	schedule := e.Record

	// Only send notification if schedule is cancelled
	if !schedule.GetBool("isCancelled") {
		return e.Next()
	}

	// Get the tenant ID (direct relation to users)
	tenantId := schedule.GetString("tenant")
	if tenantId == "" {
		return e.Next()
	}

	// Find the user record to get email
	user, err := e.App.FindRecordById("_pb_users_auth_", tenantId)
	if err != nil {
		return err
	}

	tenantEmail := user.GetString("email")
	if tenantEmail == "" {
		return e.Next()
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for cancelled schedule notification
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Schedule Cancelled")
	emailRecord.Set("message", fmt.Sprintf(`
Your scheduled appointment has been cancelled.

Schedule Details:
Reason: %s
Date: %s
Status: Cancelled

If you have any questions or need to reschedule, please contact the management office.
	`, schedule.GetString("reason"), schedule.GetString("date")))

	e.App.Save(emailRecord)

	return e.Next()
}

func NotifyApprovedSchedules(e *core.RecordEvent) error {
	// Notify tenant when a schedule is approved
	schedule := e.Record

	// Only send notification if schedule is approved
	if !schedule.GetBool("isApproved") {
		return e.Next()
	}

	// Get the tenant ID (direct relation to users)
	tenantId := schedule.GetString("tenant")
	if tenantId == "" {
		return e.Next()
	}

	// Find the user record to get email
	user, err := e.App.FindRecordById("_pb_users_auth_", tenantId)
	if err != nil {
		return err
	}

	tenantEmail := user.GetString("email")
	if tenantEmail == "" {
		return e.Next()
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for approved schedule notification
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Schedule Approved")
	emailRecord.Set("message", fmt.Sprintf(`
Your scheduled appointment has been approved.

Schedule Details:
Reason: %s
Date: %s
Message: %s
Status: Approved

Your appointment is confirmed. Please ensure you are available on the scheduled date and time.
If you need to reschedule, please contact the management office.
	`, schedule.GetString("reason"), schedule.GetString("date"), schedule.GetString("message")))

	e.App.Save(emailRecord)

	return e.Next()
}
