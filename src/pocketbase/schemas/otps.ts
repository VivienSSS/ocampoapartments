import z from "zod";

export const otpsSchema = z.object({
    collectionRef: z.string(),
    created: z.date().optional(),
    id: z.string(),
    password: z.string(),
    recordRef: z.string(),
    sentTo: z.string(),
    updated: z.date().optional(),
})

export const insertOtpsSchema = otpsSchema.omit({
    id: true,
    created: true,
    updated: true

})

export const updateOtpsSchema = insertOtpsSchema.partial()