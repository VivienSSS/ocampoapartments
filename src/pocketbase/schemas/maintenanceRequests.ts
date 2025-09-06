import z from "zod";
import { MaintenanceRequestsStatusOptions, MaintenanceRequestsUrgencyOptions } from "../types";

export const maintenanceRequestSchema = z.object({
    completedDate: z.string(),
    created: z.date().optional(),
    description: z.string(),
    id: z.string(),
    progressImage: z.file().optional(),
    status: z.enum(MaintenanceRequestsStatusOptions),
    submittedDate: z.string(),
    tenant: z.string(),
    unit: z.string(),
    updated: z.date().optional(),
    urgency: z.enum(MaintenanceRequestsUrgencyOptions),
    worker: z.string(),
})

export const insertMaintenanceRequestSchema = maintenanceRequestSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateMaintenanceRequestSchema = insertMaintenanceRequestSchema.partial()