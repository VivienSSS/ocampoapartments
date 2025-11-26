package interceptor

import "github.com/pocketbase/pocketbase/core"

func SendPaymentAcknowledgementInvoiceToEmail(e *core.RecordEvent) error {
	return e.Next()
}

func SendPaymentVerifiedInvoiceToEmail(e *core.RecordEvent) error {
	return e.Next()
}