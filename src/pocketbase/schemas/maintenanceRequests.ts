import z from "zod";
import { MaintenanceRequestsStatusOptions, MaintenanceRequestsUrgencyOptions } from "../types";

export const maintenanceRequestSchema = z.object({
    completedDate: z.date(),
    created: z.date().optional(),
    description: z.string(),
    id: z.string(),
    progressImage: z.array(z.url()),
    status: z.enum(MaintenanceRequestsStatusOptions),
    submittedDate: z.date(),
    tenant: z.string(),
    unit: z.string(),
    updated: z.date().optional(),
    urgency: z.enum(MaintenanceRequestsUrgencyOptions),
    worker: z.string(),
})

export const insertMaintenanceRequestSchema = maintenanceRequestSchema.omit({
    id: true,
    created: true,
    updated: true,
    progressImage: true
}).extend({
    progressImage: z.array(z.file())
})

export const updateMaintenanceRequestSchema = insertMaintenanceRequestSchema.partial()