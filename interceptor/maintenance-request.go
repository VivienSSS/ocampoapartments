package interceptor

import (
	"fmt"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/pocketbase/pocketbase/core"
)

func MaintenanceRequestStatusStateMachine(e *core.RecordRequestEvent) error {
	// Define valid status transitions for maintenance requests
	// Pending -> Worker Assigned -> In Progress -> Completed
	// Any status can go to Cancelled

	request, err := e.App.FindRecordById("maintenance_requests", e.Record.Id)
	if err != nil {
		return err
	}

	prevStatus := request.GetString("status")
	newStatus := e.Record.GetString("status")

	if prevStatus == newStatus {
		return e.Next()
	}

	// Allow any status to transition to Cancelled
	if newStatus == "Cancelled" {
		return e.Next()
	}

	// Define valid transitions
	validTransitions := map[string][]string{
		"Pending":         {"Worker Assigned", "Cancelled"},
		"Worker Assigned": {"In Progress", "Cancelled"},
		"In Progress":     {"Completed", "Cancelled"},
		"Completed":       {}, // Terminal state
		"Cancelled":       {}, // Terminal state
	}

	allowedStates := validTransitions[prevStatus]
	isValid := false
	for _, state := range allowedStates {
		if state == newStatus {
			isValid = true
			break
		}
	}

	if !isValid {
		return e.BadRequestError("", map[string]validation.Error{
			"status": validation.NewError("invalid_state", fmt.Sprintf("invalid status transition: %s -> %s", prevStatus, newStatus)),
		})
	}

	return e.Next()
}

func SendAcknowledgementMaintenanceRequestEmailToTenant(e *core.RecordEvent) error {
	// Send acknowledgement when maintenance request is created (Pending status)
	request := e.Record

	if request.GetString("status") != "Pending" {
		return e.Next()
	}

	// Get tenant ID from request
	tenantId := request.GetString("tenant")
	if tenantId == "" {
		return e.Next()
	}

	// Find the tenant record to get user field
	tenant, err := e.App.FindRecordById("tenants", tenantId)
	if err != nil {
		return err
	}

	// Get user ID from tenant's user field
	userId := tenant.GetString("user")
	if userId == "" {
		return e.Next()
	}

	// Find the user record to get email
	user, err := e.App.FindRecordById("_pb_users_auth_", userId)
	if err != nil {
		return err
	}

	tenantEmail := user.GetString("email")
	if tenantEmail == "" {
		return e.Next()
	}

	// Get unit information
	unitId := request.GetString("unit")
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for acknowledgement
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Maintenance Request Received")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2>Maintenance Request Received</h2>
<p>We have received your maintenance request.</p>
<div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #17a2b8;">
  <h4>Request Details:</h4>
  <p><strong>Unit:</strong> %s</p>
  <p><strong>Urgency:</strong> %s</p>
  <p><strong>Description:</strong> %s</p>
  <p><strong>Submitted Date:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #ffc107; padding: 3px 8px; border-radius: 3px;">Pending</span></p>
</div>
<p>Our team is reviewing your request and will assign a worker shortly. You will receive an update once a worker has been assigned.</p>
</body></html>
	`, unit.GetString("unitLetter"), request.GetString("urgency"), request.GetString("description"), request.GetString("submittedDate")))

	e.App.Save(emailRecord)

	return e.Next()
}

func SendWorkerAssignedMaintenanceRequestEmailToTenant(e *core.RecordEvent) error {
	// Send notification when a worker is assigned to the request
	request := e.Record

	if request.GetString("status") != "Worker Assigned" {
		return e.Next()
	}

	// Get tenant ID from request
	tenantId := request.GetString("tenant")
	if tenantId == "" {
		return e.Next()
	}

	// Find the tenant record to get user field
	tenant, err := e.App.FindRecordById("tenants", tenantId)
	if err != nil {
		return err
	}

	// Get user ID from tenant's user field
	userId := tenant.GetString("user")
	if userId == "" {
		return e.Next()
	}

	// Find the user record to get email
	user, err := e.App.FindRecordById("_pb_users_auth_", userId)
	if err != nil {
		return err
	}

	tenantEmail := user.GetString("email")
	if tenantEmail == "" {
		return e.Next()
	}

	// Get worker information
	workerId := request.GetString("worker")
	var workerName string
	if workerId != "" {
		worker, err := e.App.FindRecordById("maintenance_workers", workerId)
		if err == nil {
			workerName = worker.GetString("name")
		}
	}

	// Get unit information
	unitId := request.GetString("unit")
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for worker assignment
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Worker Assigned to Your Maintenance Request")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #5cb85c;">Worker Assigned</h2>
<p>A worker has been assigned to your maintenance request.</p>
<div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #5cb85c; margin: 15px 0;">
  <h4>Request Details:</h4>
  <p><strong>Unit:</strong> %s</p>
  <p><strong>Urgency:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #5cb85c; color: white; padding: 3px 8px; border-radius: 3px;">Worker Assigned</span></p>
  <p><strong>Assigned Worker:</strong> %s</p>
</div>
<p>The worker will contact you shortly to schedule the maintenance visit. Please keep your unit accessible during business hours.</p>
</body></html>
	`, unit.GetString("unitLetter"), request.GetString("urgency"), workerName))

	e.App.Save(emailRecord)

	return e.Next()
}

func SendInProgressEmailMaintenanceRequestToTenant(e *core.RecordEvent) error {
	// Send notification when maintenance work is in progress
	request := e.Record

	if request.GetString("status") != "In Progress" {
		return e.Next()
	}

	// Get tenant ID from request
	tenantId := request.GetString("tenant")
	if tenantId == "" {
		return e.Next()
	}

	// Find the tenant record to get user field
	tenant, err := e.App.FindRecordById("tenants", tenantId)
	if err != nil {
		return err
	}

	// Get user ID from tenant's user field
	userId := tenant.GetString("user")
	if userId == "" {
		return e.Next()
	}

	// Find the user record to get email
	user, err := e.App.FindRecordById("_pb_users_auth_", userId)
	if err != nil {
		return err
	}

	tenantEmail := user.GetString("email")
	if tenantEmail == "" {
		return e.Next()
	}

	// Get unit information
	unitId := request.GetString("unit")
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for in-progress update
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Maintenance Work In Progress")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #17a2b8;">⚙ Maintenance Work In Progress</h2>
<p>Your maintenance request is currently in progress.</p>
<div style="background-color: #d1ecf1; padding: 15px; border-left: 4px solid #17a2b8; margin: 15px 0;">
  <h4>Request Details:</h4>
  <p><strong>Unit:</strong> %s</p>
  <p><strong>Urgency:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #17a2b8; color: white; padding: 3px 8px; border-radius: 3px;">In Progress</span></p>
</div>
<p>The worker is actively working on your maintenance issue. The work should be completed shortly.</p>
<p><strong>Thank you for your patience.</strong></p>
</body></html>
	`, unit.GetString("unitLetter"), request.GetString("urgency")))

	e.App.Save(emailRecord)

	return e.Next()
}

func SendCompletionMessageMaintenanceRequestToTenant(e *core.RecordEvent) error {
	// Send notification when maintenance work is completed
	request := e.Record

	if request.GetString("status") != "Completed" {
		return e.Next()
	}

	// Get tenant ID from request
	tenantId := request.GetString("tenant")
	if tenantId == "" {
		return e.Next()
	}

	// Find the tenant record to get user field
	tenant, err := e.App.FindRecordById("tenants", tenantId)
	if err != nil {
		return err
	}

	// Get user ID from tenant's user field
	userId := tenant.GetString("user")
	if userId == "" {
		return e.Next()
	}

	// Find the user record to get email
	user, err := e.App.FindRecordById("_pb_users_auth_", userId)
	if err != nil {
		return err
	}

	tenantEmail := user.GetString("email")
	if tenantEmail == "" {
		return e.Next()
	}

	// Get unit information
	unitId := request.GetString("unit")
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for completion
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Maintenance Work Completed")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #5cb85c;">✓ Maintenance Work Completed</h2>
<p>Your maintenance request has been completed.</p>
<div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #5cb85c; margin: 15px 0;">
  <h4>Request Details:</h4>
  <p><strong>Unit:</strong> %s</p>
  <p><strong>Urgency:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #5cb85c; color: white; padding: 3px 8px; border-radius: 3px;">Completed</span></p>
  <p><strong>Completed Date:</strong> %s</p>
</div>
<p>The maintenance work on your unit has been finished. If you have any concerns or issues with the completed work, please contact the management office.</p>
<p><strong>We appreciate your cooperation.</strong></p>
</body></html>
	`, unit.GetString("unitLetter"), request.GetString("urgency"), time.Now().Format("2006-01-02")))

	e.App.Save(emailRecord)

	return e.Next()
}

func SendCancelledMessageMaintenanceRequestToTenant(e *core.RecordEvent) error {
	// Send notification when maintenance request is cancelled
	request := e.Record

	if request.GetString("status") != "Cancelled" {
		return e.Next()
	}

	// Get tenant ID from request
	tenantId := request.GetString("tenant")
	if tenantId == "" {
		return e.Next()
	}

	// Find the tenant record to get user field
	tenant, err := e.App.FindRecordById("tenants", tenantId)
	if err != nil {
		return err
	}

	// Get user ID from tenant's user field
	userId := tenant.GetString("user")
	if userId == "" {
		return e.Next()
	}

	// Find the user record to get email
	user, err := e.App.FindRecordById("_pb_users_auth_", userId)
	if err != nil {
		return err
	}

	tenantEmail := user.GetString("email")
	if tenantEmail == "" {
		return e.Next()
	}

	// Get unit information
	unitId := request.GetString("unit")
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for cancellation
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Maintenance Request Cancelled")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #d9534f;">Maintenance Request Cancelled</h2>
<p>Your maintenance request has been cancelled.</p>
<div style="background-color: #f8d7da; padding: 15px; border-left: 4px solid #d9534f; margin: 15px 0;">
  <h4>Request Details:</h4>
  <p><strong>Unit:</strong> %s</p>
  <p><strong>Urgency:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #d9534f; color: white; padding: 3px 8px; border-radius: 3px;">Cancelled</span></p>
</div>
<p>Your maintenance request has been cancelled. If you still require maintenance assistance, please submit a new request.</p>
<p>If you have any questions, please contact the management office.</p>
</body></html>
	`, unit.GetString("unitLetter"), request.GetString("urgency")))

	e.App.Save(emailRecord)

	return e.Next()
}
