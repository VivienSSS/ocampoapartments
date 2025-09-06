import z from "zod";

export const mfasSchema = z.object({
    collectionRef: z.string(),
    created: z.date().optional(),
    id: z.string(),
    method: z.string(),
    recordRef: z.string(),
    updated: z.date().optional(),
})

export const insertMfasSchema = mfasSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateMfasSchema = insertMfasSchema.partial()