package interceptor

import (
	"fmt"

	"github.com/pocketbase/pocketbase/core"
)

func SendPaymentAcknowledgementInvoiceToEmail(e *core.RecordEvent) error {
	payment := e.Record

	// Get the tenant ID from the payment
	tenantId := payment.GetString("tenant")
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

	// Get the bill information
	billId := payment.GetString("bill")
	bill, err := e.App.FindRecordById("bills", billId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for payment acknowledgement
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Payment Received - Under Verification")
	emailRecord.Set("message", fmt.Sprintf(`
We have received your payment.

Payment Details:
Invoice Number: %s
Amount Paid: %v
Payment Method: %s
Payment Date: %s
Transaction ID: %s

Your payment is being verified. You will receive another notification once it has been confirmed.
If you have any questions, please contact the management office.
	`, bill.GetString("invoiceNumber"), payment.Get("amountPaid"), payment.GetString("paymentMethod"), payment.GetString("paymentDate"), payment.GetString("transactionId")))

	e.App.Save(emailRecord)

	// Mark as sent
	payment.Set("hasSent", true)

	return e.Next()
}

func SendPaymentVerifiedInvoiceToEmail(e *core.RecordEvent) error {
	// Only send verification if isVerified becomes true
	payment := e.Record

	if !payment.GetBool("isVerified") {
		return e.Next()
	}

	// Get the tenant ID from the payment
	tenantId := payment.GetString("tenant")
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

	// Get the bill information
	billId := payment.GetString("bill")
	bill, err := e.App.FindRecordById("bills", billId)
	if err != nil {
		return err
	}

	// Get emails collection
	emailCollection, err := e.App.FindCollectionByNameOrId("emails")
	if err != nil {
		return err
	}

	// Create email record for payment verification
	emailRecord := core.NewRecord(emailCollection)
	emailRecord.Set("to", tenantEmail)
	emailRecord.Set("subject", "Payment Confirmed")
	emailRecord.Set("message", fmt.Sprintf(`
Your payment has been verified and confirmed.

Payment Confirmation Details:
Invoice Number: %s
Amount Paid: %s
Payment Method: %s
Payment Date: %s
Status: Confirmed

Thank you for your payment. Your bill has been marked as paid.
If you have any questions, please contact the management office.
	`, bill.GetString("invoiceNumber"), payment.Get("amountPaid"), payment.GetString("paymentMethod"), payment.GetString("paymentDate")))

	e.App.Save(emailRecord)

	return e.Next()
}
