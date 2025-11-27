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
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2>New Schedule Created</h2>
<p>A new schedule has been created for you.</p>
<div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #17a2b8;">
  <h4>Schedule Details:</h4>
  <p><strong>Reason:</strong> %s</p>
  <p><strong>Date:</strong> %s</p>
  <p><strong>Message:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #ffc107; padding: 3px 8px; border-radius: 3px;">Pending Approval</span></p>
</div>
<p>Please wait for approval from the management office. You will receive a notification once it has been reviewed.</p>
</body></html>
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
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #d9534f;">Schedule Cancelled</h2>
<p>Your scheduled appointment has been cancelled.</p>
<div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #d9534f;">
  <h4>Schedule Details:</h4>
  <p><strong>Reason:</strong> %s</p>
  <p><strong>Date:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #d9534f; color: white; padding: 3px 8px; border-radius: 3px;">Cancelled</span></p>
</div>
<p>If you have any questions or need to reschedule, please contact the management office.</p>
</body></html>
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
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #5cb85c;">✓ Schedule Approved</h2>
<p>Your scheduled appointment has been approved.</p>
<div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #5cb85c; margin: 15px 0;">
  <h4>Schedule Details:</h4>
  <p><strong>Reason:</strong> %s</p>
  <p><strong>Date:</strong> %s</p>
  <p><strong>Message:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #5cb85c; color: white; padding: 3px 8px; border-radius: 3px;">Approved</span></p>
</div>
<p>Your appointment is confirmed. Please ensure you are available on the scheduled date and time.</p>
<p>If you need to reschedule, please contact the management office.</p>
</body></html>
	`, schedule.GetString("reason"), schedule.GetString("date"), schedule.GetString("message")))

	e.App.Save(emailRecord)

	return e.Next()
}
