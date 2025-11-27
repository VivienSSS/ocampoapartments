package interceptor

import (
	"fmt"
	"time"

	"github.com/pocketbase/pocketbase/core"
)

func SendRecurringBillInvoiceToTenant(e *core.RecordEvent) error {
	// Send recurring bill invoice when a new bill is created for this tenancy
	// This function should be called from bills interceptor or via scheduled task
	tenancy := e.Record

	// Get tenant ID from tenancy
	tenantId := tenancy.GetString("tenant")
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
	unitId := tenancy.GetString("unit")
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for recurring bill
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Monthly Bill Invoice Available")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2>Monthly Bill Invoice Available</h2>
<p>Your monthly bill invoice is now available.</p>
<div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #007bff;">
  <h4>Tenancy Details:</h4>
  <p><strong>Unit:</strong> %s</p>
  <p><strong>Lease Start Date:</strong> %s</p>
  <p><strong>Lease End Date:</strong> %s</p>
</div>
<p>Please log into your account to view and pay your bill.</p>
<p>For questions, please contact the management office.</p>
</body></html>
	`, unit.GetString("unitLetter"), tenancy.GetString("leaseStartDate"), tenancy.GetString("leaseEndDate")))

	e.App.Save(emailRecord)

	return e.Next()
}

func NotifyTenantBeforeBillInvoiceDueDate(e *core.RecordEvent) error {
	// Send reminder notification a few days before bill due date
	// This would typically be triggered by a scheduled task
	tenancy := e.Record

	// Get tenant ID from tenancy
	tenantId := tenancy.GetString("tenant")
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

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for bill due date reminder
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Bill Due Date Reminder")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #ff6b6b;">📋 Bill Due Date Reminder</h2>
<p>Your bill payment is due soon.</p>
<div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 15px 0;">
  <p><strong>Lease End Date:</strong> %s</p>
  <p><strong>Lease Start Date:</strong> %s</p>
</div>
<p><strong>Please arrange payment before the due date to avoid late fees and penalties.</strong></p>
<p>Log into your account to view your bill details and make payment.</p>
</body></html>
	`, tenancy.GetString("leaseEndDate"), tenancy.GetString("leaseStartDate")))

	e.App.Save(emailRecord)

	return e.Next()
}

func SendNearLeaseContractTerminationToTenant(e *core.RecordEvent) error {
	// Send notification when lease is nearing termination (e.g., 30 days before end date)
	tenancy := e.Record

	// Get tenant ID from tenancy
	tenantId := tenancy.GetString("tenant")
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
	unitId := tenancy.GetString("unit")
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for lease termination notice
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Lease Contract Termination Notice")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #ff6b6b;">📋 Lease Contract Termination Notice</h2>
<p>Your lease contract is expiring soon.</p>
<div style="background-color: #f8d7da; padding: 15px; border-left: 4px solid #f5c6cb; margin: 15px 0;">
  <p><strong>Unit:</strong> %s</p>
  <p><strong>Lease End Date:</strong> %s</p>
</div>
<p>If you wish to renew your lease or discuss move-out procedures, please contact the management office immediately.</p>
<p style="color: #d9534f;"><strong>Failure to vacate on the lease end date may result in penalties and eviction proceedings.</strong></p>
</body></html>
	`, unit.GetString("unitLetter"), tenancy.GetString("leaseEndDate")))

	e.App.Save(emailRecord)

	return e.Next()
}

func SendEvictionNoticeToTenant(e *core.RecordEvent) error {
	// Send formal eviction notice when lease has ended and tenant has not vacated
	tenancy := e.Record

	// Get tenant ID from tenancy
	tenantId := tenancy.GetString("tenant")
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
	unitId := tenancy.GetString("unit")
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for eviction notice
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Formal Eviction Notice")
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #d9534f; text-transform: uppercase;">⚠ Formal Eviction Notice</h2>
<p>This is a formal eviction notice regarding your tenancy.</p>
<div style="background-color: #f8d7da; padding: 15px; border-left: 4px solid #d9534f; margin: 15px 0;">
  <p><strong>Unit:</strong> %s</p>
  <p><strong>Lease End Date:</strong> %s</p>
  <p><strong>Current Date:</strong> %s</p>
</div>
<p style="color: #d9534f;"><strong>Your lease has ended and you have not vacated the premises. You must vacate immediately.</strong></p>
<p style="color: #d9534f;"><strong>Failure to vacate within 72 hours may result in legal action and forced removal.</strong></p>
<p><strong>Please contact the management office immediately to arrange your move-out or discuss reinstatement of your lease.</strong></p>
</body></html>
	`, unit.GetString("unitLetter"), tenancy.GetString("leaseEndDate"), time.Now().Format("2006-01-02")))

	e.App.Save(emailRecord)

	return e.Next()
}
