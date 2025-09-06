import z from "zod";

export const maintenanceWorkerSchema = z.object({
    contactDetails: z.string(),
    created: z.date().optional(),
    id: z.string(),
    isAvailable: z.boolean(),
    name: z.string(),
    updated: z.date().optional(),
})

export const insertMaintenanceWorkerSchema = maintenanceWorkerSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateMaintenanceWorkerSchema = insertMaintenanceWorkerSchema.partial()