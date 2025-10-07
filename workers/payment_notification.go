package workers

import (
	"fmt"
	"net/mail"

	"github.com/pocketbase/dbx"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/tools/mailer"
)

func PaymentNotification(app *pocketbase.PocketBase) {
	// send notification
	app.OnRecordAfterCreateSuccess("payments").BindFunc(func(e *core.RecordEvent) error {

		var HTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .email-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #4CAF50;
        }
        .header h1 {
            color: #4CAF50;
            margin: 0;
            font-size: 28px;
        }
        .payment-details {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #4CAF50;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 5px 0;
        }
        .detail-label {
            font-weight: bold;
            color: #555;
        }
        .detail-value {
            color: #333;
        }
        .amount {
            font-size: 24px;
            font-weight: bold;
            color: #4CAF50;
            text-align: center;
            margin: 20px 0;
            padding: 15px;
            background-color: #e8f5e8;
            border-radius: 8px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .success-icon {
            color: #4CAF50;
            font-size: 48px;
            text-align: center;
            margin-bottom: 20px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .email-container {
                padding: 20px;
            }
            .detail-row {
                flex-direction: column;
            }
            .detail-label {
                margin-bottom: 5px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>Payment Received</h1>
            <p>%s</p>
        </div>
        
        <p>Dear Administrator,</p>
        
        <p>We have received a new payment from one of our tenants. Here are the payment details:</p>
        
        <div class="payment-details">
            <div class="detail-row">
                <span class="detail-label">Tenant Name:</span>
                <span class="detail-value">%s</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Amount:</span>
                <span class="detail-value">₱%.2f</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Bill Due Date:</span>
                <span class="detail-value">%s</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Date:</span>
                <span class="detail-value">%s</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Payment Method:</span>
                <span class="detail-value">%s</span>
            </div>
        </div>
        
        <div class="amount">
            Payment Amount: ₱%.2f
        </div>
        
        <p>Please log in to the admin dashboard to view more details and manage this payment.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="%s" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Dashboard</a>
        </div>
        
        <div class="footer">
            <p>This is an automated notification from %s</p>
            <p>If you have any questions, please contact the system administrator.</p>
        </div>
    </div>
</body>
</html>`

		if err := e.Next(); err != nil {
			return err
		}

		admins, err := e.App.FindRecordsByFilter("users", "role = {:role}", "-created", 1000, 0, dbx.Params{"role": "Administrator"})

		if err != nil {
			return fmt.Errorf("failed to find administrators: %v", err)
		}

		if len(admins) == 0 {
			// No administrators found, skip notification
			return nil
		}

		mainUrl := fmt.Sprintf("%s/dashboard/payment", e.App.Settings().Meta.AppURL)
		appName := e.App.Settings().Meta.AppName

		// Get tenant ID from payment record
		tenantId := e.Record.GetString("tenant")
		if tenantId == "" {
			return fmt.Errorf("payment record missing tenant ID")
		}

		tenant, err := e.App.FindRecordById("tenants", tenantId)
		if err != nil {
			return fmt.Errorf("failed to find tenant with ID %s: %v", tenantId, err)
		}

		// Get bill ID from payment record
		billId := e.Record.GetString("bill")
		if billId == "" {
			return fmt.Errorf("payment record missing bill ID")
		}

		bill, err := e.App.FindRecordById("bills", billId)
		if err != nil {
			return fmt.Errorf("failed to find bill with ID %s: %v", billId, err)
		}

		// Get user ID from tenant record
		userId := tenant.GetString("user")
		if userId == "" {
			return fmt.Errorf("tenant record missing user ID")
		}

		user, err := e.App.FindRecordById("users", userId)
		if err != nil {
			return fmt.Errorf("failed to find user with ID %s: %v", userId, err)
		}

		dueDate := bill.GetString("dueDate")
		userFullName := fmt.Sprintf("%s %s", user.GetString("firstName"), user.GetString("lastName"))
		paymentAmount := e.Record.GetFloat("amount")
		paymentDate := e.Record.GetString("created")
		paymentMethod := e.Record.GetString("paymentMethod")

		// Default values for missing data
		if dueDate == "" {
			dueDate = "Not specified"
		}
		if userFullName == " " || userFullName == "" {
			userFullName = "Unknown Tenant"
		}
		if paymentMethod == "" {
			paymentMethod = "Not specified"
		}

		subject := "New Payment Received"
		emailHTML := fmt.Sprintf(HTML, appName, userFullName, paymentAmount, dueDate, paymentDate, paymentMethod, paymentAmount, mainUrl, appName)

		for _, admin := range admins {
			message := &mailer.Message{
				From: mail.Address{
					Address: e.App.Settings().Meta.SenderAddress,
					Name:    e.App.Settings().Meta.SenderName,
				},
				To:      []mail.Address{{Address: admin.Email()}},
				Subject: subject,
				HTML:    emailHTML,
			}

			if err := e.App.NewMailClient().Send(message); err != nil {
				return err
			}

		}

		return e.Next()
	})
}
