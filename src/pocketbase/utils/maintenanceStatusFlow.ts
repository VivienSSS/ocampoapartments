import { MaintenanceRequestsStatusOptions } from '../types';

// Define valid transitions: from -> to[]
const validTransitions: Record<MaintenanceRequestsStatusOptions, MaintenanceRequestsStatusOptions[]> = {
    [MaintenanceRequestsStatusOptions.Pending]: [MaintenanceRequestsStatusOptions['Worker Assigned']],
    [MaintenanceRequestsStatusOptions['Worker Assigned']]: [MaintenanceRequestsStatusOptions['In Progress']],
    [MaintenanceRequestsStatusOptions['In Progress']]: [MaintenanceRequestsStatusOptions.Completed],
    [MaintenanceRequestsStatusOptions.Completed]: [],
};

export function isValidStatusTransition(
    currentStatus: MaintenanceRequestsStatusOptions | undefined,
    newStatus: MaintenanceRequestsStatusOptions,
): boolean {
    // If no current status, only allow Pending
    if (!currentStatus) {
        return newStatus === MaintenanceRequestsStatusOptions.Pending;
    }

    // Check if transition is allowed
    return validTransitions[currentStatus]?.includes(newStatus) ?? false;
}

export function getNextStatuses(
    currentStatus?: MaintenanceRequestsStatusOptions,
): MaintenanceRequestsStatusOptions[] {
    if (!currentStatus) {
        return [MaintenanceRequestsStatusOptions.Pending];
    }

    return validTransitions[currentStatus] ?? [];
}
