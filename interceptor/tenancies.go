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
	emailRecord.Set("message", fmt.Sprintf(`
Your monthly bill invoice is now available.

Tenancy Details:
Unit: %s
Lease Start Date: %s
Lease End Date: %s

Please log into your account to view and pay your bill.
For questions, please contact the management office.
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
	emailRecord.Set("message", fmt.Sprintf(`
BILL DUE DATE REMINDER

Your bill payment is due soon.

Lease End Date: %s
Lease Start Date: %s

Please arrange payment before the due date to avoid late fees and penalties.
Log into your account to view your bill details and make payment.
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
	emailRecord.Set("message", fmt.Sprintf(`
LEASE CONTRACT TERMINATION NOTICE

Your lease contract is expiring soon.

Unit: %s
Lease End Date: %s

If you wish to renew your lease or discuss move-out procedures, please contact the management office immediately.
Failure to vacate on the lease end date may result in penalties and eviction proceedings.
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
	emailRecord.Set("message", fmt.Sprintf(`
FORMAL EVICTION NOTICE

This is a formal eviction notice regarding your tenancy.

Unit: %s
Lease End Date: %s
Current Date: %s

Your lease has ended and you have not vacated the premises. You must vacate immediately.
Failure to vacate within 72 hours may result in legal action and forced removal.

Please contact the management office immediately to arrange your move-out or discuss reinstatement of your lease.
	`, unit.GetString("unitLetter"), tenancy.GetString("leaseEndDate"), time.Now().Format("2006-01-02")))

	e.App.Save(emailRecord)

	return e.Next()
}
