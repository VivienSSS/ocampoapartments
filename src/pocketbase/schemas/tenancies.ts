import z from "zod";

export const tenanciesSchema = z.object({
    created: z.date().optional(),
    id: z.string(),
    leaseEndDate: z.string(),
    leaseStartDate: z.string(),
    tenant: z.string(),
    unit: z.string(),
    updated: z.date().optional(),
})

export const insertTenanciesSchema = tenanciesSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateTenanciesSchema = insertTenanciesSchema.partial()