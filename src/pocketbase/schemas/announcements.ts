import z from 'zod';

export const announcementSchema = z.object({
  author: z.string().nonempty('Author is required'),
  created: z.date().optional(),
  id: z.string(),
  message: z
    .string()
    .nonempty('Message field required')
    .min(10, 'Message should contain at least 10 characters long'),
  title: z
    .string()
    .nonempty('Title field required')
    .min(10, 'Title should contain at least 10 characters long'),
  updated: z.date().optional(),
});

export const insertAnnouncementSchema = announcementSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateAnnouncementSchema = insertAnnouncementSchema.partial();
