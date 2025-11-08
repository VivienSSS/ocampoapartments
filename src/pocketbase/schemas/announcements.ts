import { fieldConfig } from '@autoform/zod';
import type React from 'react';
import z from 'zod';
import type { FieldTypes } from '@/components/ui/autoform';

export const announcementSchema = z.object({
  author: z.string(),
  created: z.date().optional(),
  id: z.string(),
  message: z
    .string()
    .nonempty('Message field required')
    .min(10, 'Message should contain atlest 10 characters long'),
  title: z
    .string()
    .nonempty('Title field required')
    .min(10, 'Title should contain atleast 10 characters long'),
  updated: z.date().optional(),
});

export const insertAnnouncementSchema = announcementSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateAnnouncementSchema = insertAnnouncementSchema.partial();
