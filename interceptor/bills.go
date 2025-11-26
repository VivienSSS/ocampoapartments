package interceptor

import "github.com/pocketbase/pocketbase/core"

func GenerateInvoiceNumber(e *core.RecordRequestEvent) error {

	// generate a new invoice number. format: INVOICE-<DATE>-<LAST-ROW-NUMBER-INSERED-FOR-THE-DAY>
	e.Record.Set("invoiceNumber","INVOICE-2025-111")

	return e.Next()
}

func SendBillInvoiceToTenants(e *core.RecordEvent) error {

	// send the invoice to the tenant's email

	return e.Next()
}

func SendOverdueNoticeToTenant(e *core.RecordEvent) error {
	return e.Next()
}