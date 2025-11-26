package interceptor

import "github.com/pocketbase/pocketbase/core"

func MaintenanceRequestStatusStateMachine(e *core.RecordRequestEvent) error {
	return e.Next()
}

func SendAcknowledgementMaintenanceRequestEmailToTenant(e *core.RecordEvent) error {
	return e.Next()
}

func SendWorkerAssignedMaintenanceRequestEmailToTenant(e *core.RecordEvent) error {
	return e.Next()
}

func SendInProgressEmailMaintenanceRequestToTenant(e *core.RecordEvent) error {
	return e.Next()
}

func SendCompletionMessageMaintenanceRequestToTenant(e *core.RecordEvent) error {
	return e.Next()
}

func SendCancelledMessageMaintenanceRequestToTenant(e *core.RecordEvent) error {
	return e.Next()
}