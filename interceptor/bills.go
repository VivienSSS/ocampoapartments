package interceptor

import (
	"fmt"
	"time"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/pocketbase/pocketbase/core"
)

func BillsStateMachine(e *core.RecordRequestEvent) error {
	// state machine:
	// Due ->
	// Paid or Overdue: Terminal state

	bill, err := e.App.FindRecordById("bills", e.Record.Id)
	if err != nil {
		return err
	}

	prevStatus := bill.GetString("status")
	newStatus := e.Record.GetString("status")

	if prevStatus == newStatus {
		return e.Next()
	}

	// Terminal states: Paid, Overdue
	if prevStatus == "Paid" || prevStatus == "Overdue" {

		return e.BadRequestError("", map[string]validation.Error{
			"status": validation.NewError("invalid_state", fmt.Sprintf("cannot change status from terminal state: %s", prevStatus)),
		})
	}

	// Only allow Due -> Paid or Due -> Overdue
	if prevStatus == "Due" && (newStatus == "Paid" || newStatus == "Overdue") {
		return e.Next()
	}

	return e.BadRequestError("", map[string]validation.Error{
		"status": validation.NewError("invalid_state", fmt.Sprintf("invalid status transition: %s -> %s", prevStatus, newStatus)),
	})
}

func GenerateInvoiceNumber(e *core.RecordRequestEvent) error {
	// generate a new invoice number. format: INVOICE-<YEAR>-<LAST-ROW-NUMBER-INSERTED-FOR-THE-DAY>

	// Get today's date in YYYY format
	year := time.Now().Year()
	dateStr := fmt.Sprintf("%04d", year)

	// Query all bills created today to find the highest sequence number
	today := time.Now().Truncate(24 * time.Hour)
	tomorrow := today.AddDate(0, 0, 1)

	records, err := e.App.FindRecordsByFilter(
		"bills",
		fmt.Sprintf("created >= '%s' AND created < '%s'", today.Format("2006-01-02 15:04:05"), tomorrow.Format("2006-01-02 15:04:05")),
		"-created", // Sort by created descending to get the latest
		1,          // Limit to 1 result
		0,          // Offset
	)
	if err != nil {
		return err
	}

	// Determine the next sequence number
	sequenceNumber := 1
	if len(records) > 0 {
		lastRecord := records[0]
		lastInvoiceNumber := lastRecord.GetString("invoiceNumber")

		// Extract the sequence number from the last invoice (format: INVOICE-YYYY-###)
		if lastInvoiceNumber != "" {
			// Parse the last number from the invoice number string
			var lastSeq int
			_, err := fmt.Sscanf(lastInvoiceNumber, "INVOICE-%*d-%d", &lastSeq)
			if err == nil {
				sequenceNumber = lastSeq + 1
			}
		}
	}

	// Generate the new invoice number
	invoiceNumber := fmt.Sprintf("INVOICE-%s-%03d", dateStr, sequenceNumber)
	e.Record.Set("invoiceNumber", invoiceNumber)

	return e.Next()
}

func SendBillInvoiceToTenants(e *core.RecordEvent) error {
	// Get the bill record
	bill := e.Record

	// Get the tenancy ID to find tenant information
	tenancyId := bill.GetString("tenancy")
	if tenancyId == "" {
		return e.Next()
	}

	// Find the tenancy record
	tenancy, err := e.App.FindRecordById("tenancies", tenancyId)
	if err != nil {
		return err
	}

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

	// Create email record for invoice
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("message", fmt.Sprintf(`
Your bill invoice has been generated.

Invoice Number: %s
Status: %s
Amount: %v

Please review your invoice and arrange payment accordingly.
If you have any questions, please contact the management office.
	`, bill.GetString("invoiceNumber"), bill.GetString("status"), bill.Get("amount")))

	e.App.Save(emailRecord)

	return e.Next()
}

func SendOverdueNoticeToTenant(e *core.RecordEvent) error {
	// Only send notice if status changed to Overdue
	bill := e.Record

	if bill.GetString("status") != "Overdue" {
		return e.Next()
	}

	// Get the tenancy ID to find tenant information
	tenancyId := bill.GetString("tenancy")
	if tenancyId == "" {
		return e.Next()
	}

	// Find the tenancy record
	tenancy, err := e.App.FindRecordById("tenancies", tenancyId)
	if err != nil {
		return err
	}

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

	// Create email record for overdue notice
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("message", fmt.Sprintf(`
OVERDUE PAYMENT NOTICE

Your bill payment is now overdue.

Invoice Number: %s
Amount Due: %v
Due Date: %s

Please remit payment immediately to avoid penalties or further action.
Contact the management office if you have payment concerns.
	`, bill.GetString("invoiceNumber"), bill.Get("amount"), bill.GetString("dueDate")))

	e.App.Save(emailRecord)

	return e.Next()
}
