package interceptor

import "github.com/pocketbase/pocketbase/core"

func SendRecurringBillInvoiceToTenant(e *core.RecordEvent) error {
	return e.Next()
}

func NotifyTenantBeforeBillInvoiceDueDate(e *core.RecordEvent) error {
	return e.Next()
}

func SendNearLeaseContractTerminationToTenant(e *core.RecordEvent) error {
	return e.Next()
}

func SendEvictionNoticeToTenant(e *core.RecordEvent) error {
	return e.Next()
}