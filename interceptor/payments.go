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

	// Calculate total amount from bill items and build breakdown
	var billItemsBreakdown string = "Bill Items Breakdown:\n"
	billItems := bill.GetStringSlice("items")
	if len(billItems) > 0 {
		for _, itemId := range billItems {
			item, err := e.App.FindRecordById("bill_items", itemId)
			if err == nil {
				chargeType := item.GetString("chargeType")
				amount := item.Get("amount")
				if amount != nil {
					if floatVal, ok := amount.(float64); ok {
						billItemsBreakdown += fmt.Sprintf("- %s: %.2f\n", chargeType, floatVal)
					}
				}
			}
		}
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
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2>Payment Received</h2>
<p>We have received your payment.</p>
<div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #17a2b8;">
  <h4>Payment Details:</h4>
  <p><strong>Invoice Number:</strong> %s</p>
  <p><strong>Amount Paid:</strong> %.2f</p>
  <p><strong>Payment Method:</strong> %s</p>
  <p><strong>Payment Date:</strong> %s</p>
  <p><strong>Transaction ID:</strong> %s</p>
</div>
<div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0;">
  %s
</div>
<p style="background-color: #fff3cd; padding: 10px; border-left: 4px solid #ffc107;"><strong>Your payment is being verified. You will receive another notification once it has been confirmed.</strong></p>
<p>If you have any questions, please contact the management office.</p>
</body></html>
	`, bill.GetString("invoiceNumber"), payment.Get("amountPaid"), payment.GetString("paymentMethod"), payment.GetString("paymentDate"), payment.GetString("transactionId"), billItemsBreakdown))

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

	// Calculate total amount from bill items and build breakdown
	var billItemsBreakdown string = "Bill Items Breakdown:\n"
	billItems := bill.GetStringSlice("items")
	if len(billItems) > 0 {
		for _, itemId := range billItems {
			item, err := e.App.FindRecordById("bill_items", itemId)
			if err == nil {
				chargeType := item.GetString("chargeType")
				amount := item.Get("amount")
				if amount != nil {
					if floatVal, ok := amount.(float64); ok {
						billItemsBreakdown += fmt.Sprintf("- %s: %.2f\n", chargeType, floatVal)
					}
				}
			}
		}
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
	emailRecord.Set("message", fmt.Sprintf(`<html><body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<h2 style="color: #5cb85c;">✓ Payment Confirmed</h2>
<p>Your payment has been verified and confirmed.</p>
<div style="background-color: #d4edda; padding: 15px; border-left: 4px solid #5cb85c; margin: 15px 0;">
  <h4>Payment Confirmation Details:</h4>
  <p><strong>Invoice Number:</strong> %s</p>
  <p><strong>Amount Paid:</strong> %.2f</p>
  <p><strong>Payment Method:</strong> %s</p>
  <p><strong>Payment Date:</strong> %s</p>
  <p><strong>Status:</strong> <span style="background-color: #5cb85c; color: white; padding: 3px 8px; border-radius: 3px;">Confirmed</span></p>
</div>
<div style="background-color: #f9f9f9; padding: 15px; margin: 15px 0;">
  %s
</div>
<p><strong>Thank you for your payment. Your bill has been marked as paid.</strong></p>
<p>If you have any questions, please contact the management office.</p>
</body></html>
	`, bill.GetString("invoiceNumber"), payment.Get("amountPaid"), payment.GetString("paymentMethod"), payment.GetString("paymentDate"), billItemsBreakdown))

	e.App.Save(emailRecord)

	return e.Next()
}
