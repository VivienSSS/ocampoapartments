import z from "zod";

export const announcementSchema = z.object({
    author: z.string(),
    created: z.date().optional(),
    id: z.string(),
    message: z.string(),
    title: z.string(),
    updated: z.date().optional(),
})

export const insertAnnouncementSchema = announcementSchema.omit({
    id: true,
    created: true,
    updated: true
})

export const updateAnnouncementSchema = insertAnnouncementSchema.partial()