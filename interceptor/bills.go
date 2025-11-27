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

	// Skip if bill status is draft
	if bill.GetString("status") == "Draft" {
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

	// Create email record for invoice
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Bill Invoice Generated")
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
	// Skip if bill status is draft
	bill := e.Record

	if bill.GetString("status") == "Draft" {
		return e.Next()
	}

	// Only send notice if status changed to Overdue
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
	emailRecord.Set("subject", "Payment Overdue Notice")
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

func CreateMonthlyBillsCron(app core.App) error {
	// Cron job that runs every 30 seconds to create bills for tenancies
	// Only creates a bill if today is 7 days before the monthly due date

	today := time.Now()

	// Find all active tenancies (where leaseEndDate is today or in the future)
	tenancies, err := app.FindRecordsByFilter(
		"tenancies",
		fmt.Sprintf("leaseEndDate >= '%s'", today.Format("2006-01-02")),
		"",
		0,
		0,
	)
	if err != nil {
		return err
	}

	for _, tenancy := range tenancies {
		// Get the unit ID from tenancy
		unitId := tenancy.GetString("unit")
		if unitId == "" {
			continue
		}

		// Find the apartment unit to get the rental price
		unit, err := app.FindRecordById("apartment_units", unitId)
		if err != nil {
			continue
		}

		// Get the lease start date
		leaseStartDate := tenancy.GetString("leaseStartDate")
		if leaseStartDate == "" {
			continue
		}

		// Parse lease start date
		parsedDate, err := time.Parse("2006-01-02", leaseStartDate)
		if err != nil {
			continue
		}

		// Calculate the monthly due date (same day as lease start, each month)
		currentMonthDueDate := time.Date(today.Year(), today.Month(), parsedDate.Day(), 0, 0, 0, 0, time.UTC)

		// If the due date has already passed this month, calculate next month's due date
		if currentMonthDueDate.Before(today) {
			currentMonthDueDate = currentMonthDueDate.AddDate(0, 1, 0)
		}

		// Check if today is 7 days before the due date
		sevenDaysBefore := currentMonthDueDate.AddDate(0, 0, -7)

		// Only create bill if today matches the 7-day-before date
		if today.Format("2006-01-02") != sevenDaysBefore.Format("2006-01-02") {
			continue
		}

		// Check if a bill already exists for this tenancy with the same due date
		existingBills, err := app.FindRecordsByFilter(
			"bills",
			fmt.Sprintf("tenancy = '%s' AND dueDate = '%s'", tenancy.Id, currentMonthDueDate.Format("2006-01-02")),
			"",
			1,
			0,
		)
		if err == nil && len(existingBills) > 0 {
			// Bill already exists for this due date, skip
			continue
		}

		price := unit.Get("price")

		// Get bills collection
		billsCollection, err := app.FindCollectionByNameOrId("bills")
		if err != nil {
			continue
		}

		// Get bill_items collection
		billItemsCollection, err := app.FindCollectionByNameOrId("bill_items")
		if err != nil {
			continue
		}

		// Create a bill item for the rent charge
		billItem := core.NewRecord(billItemsCollection)
		billItem.Set("chargeType", "Rent")
		billItem.Set("amount", price)
		billItem.Set("description", fmt.Sprintf("Monthly rent for unit %s", unit.GetString("unitLetter")))

		if err := app.Save(billItem); err != nil {
			continue
		}

		// Create a bill record
		bill := core.NewRecord(billsCollection)
		bill.Set("tenancy", tenancy.Id)
		bill.Set("dueDate", currentMonthDueDate.Format("2006-01-02"))
		bill.Set("status", "Draft")
		bill.Set("items", []string{billItem.Id})

		if err := app.Save(bill); err != nil {
			continue
		}
	}

	return nil
}

func CreateBillsAndItemsForTenancy(e *core.RecordEvent) error {
	// Create bills and bill_items when a new tenancy is created
	// The bill will have a rent item based on the apartment unit's price

	tenancy := e.Record

	// Get the unit ID from tenancy
	unitId := tenancy.GetString("unit")
	if unitId == "" {
		return e.Next()
	}

	// Find the apartment unit to get the rental price
	unit, err := e.App.FindRecordById("apartment_units", unitId)
	if err != nil {
		return err
	}

	price := unit.Get("price")

	// Get bills collection
	billsCollection, err := e.App.FindCollectionByNameOrId("bills")
	if err != nil {
		return err
	}

	// Get bill_items collection
	billItemsCollection, err := e.App.FindCollectionByNameOrId("bill_items")
	if err != nil {
		return err
	}

	// Get lease start date from tenancy
	leaseStartDate := tenancy.GetString("leaseStartDate")
	if leaseStartDate == "" {
		return e.Next()
	}

	// Parse the lease start date to calculate due date (first day of next month)
	parsedDate, err := time.Parse("2006-01-02", leaseStartDate)
	if err != nil {
		return err
	}

	// Set due date to the first day of the next month
	dueDate := parsedDate.AddDate(0, 1, 0)
	dueDateStr := dueDate.Format("2006-01-02")

	// Create a bill item for the rent charge
	billItem := core.NewRecord(billItemsCollection)
	billItem.Set("chargeType", "Rent")
	billItem.Set("amount", price)
	billItem.Set("description", fmt.Sprintf("Monthly rent for unit %s", unit.GetString("unitLetter")))

	if err := e.App.Save(billItem); err != nil {
		return err
	}

	// Create a bill record
	bill := core.NewRecord(billsCollection)
	bill.Set("tenancy", tenancy.Id)
	bill.Set("dueDate", dueDateStr)
	bill.Set("status", "Due")
	bill.Set("items", []string{billItem.Id})

	if err := e.App.Save(bill); err != nil {
		return err
	}

	return e.Next()
}
