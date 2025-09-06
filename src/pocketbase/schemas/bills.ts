import z from "zod";
import { BillsStatusOptions } from "../types";

export const billSchema = z.object({
    created: z.date().optional(),
    dueDate: z.string(),
    id: z.string(),
    status: z.enum(BillsStatusOptions),
    tenancy: z.string(),
    updated: z.date().optional(),
})

export const insertBillSchema = billSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateBillSchema = insertBillSchema.partial()