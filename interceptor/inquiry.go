package interceptor

import "github.com/pocketbase/pocketbase/core"

func SendInquiryAcknoledgementToApplicantEmail(e *core.RecordEvent) error {
	return e.Next()
}

func SendApproveInquiryToApplicantEmail(e *core.RecordEvent) error {
	return e.Next()
}

func SendRejectionLetterToApplicantEmail(e *core.RecordEvent) error {
	return e.Next()
}

func SetFirstTimeUserToFalseInUserOnceUserChangeItsPassword(e *core.RecordEvent) error {
	return e.Next()
}