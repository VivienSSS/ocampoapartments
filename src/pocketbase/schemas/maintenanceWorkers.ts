import z from "zod";

export const maintenanceWorkerSchema = z.object({
    contactDetails: z.string(),
    created: z.date().optional(),
    id: z.string(),
    isAvailable: z.boolean().default(true),
    name: z.string().min(3).max(255),
    updated: z.date().optional(),
})

export const insertMaintenanceWorkerSchema = maintenanceWorkerSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateMaintenanceWorkerSchema = insertMaintenanceWorkerSchema.partial()