import z from "zod";

export const externalAuthsSchema = z.object({
    collectionRef: z.string(),
    created: z.date().optional(),
    id: z.string(),
    provider: z.string(),
    providerId: z.string(),
    recordRef: z.string(),
    updated: z.date().optional(),
})

export const insertExternalAuthsSchema = externalAuthsSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateExternalAuthsSchema = insertExternalAuthsSchema.partial()