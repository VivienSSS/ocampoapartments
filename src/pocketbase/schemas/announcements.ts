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
    .check(
      fieldConfig<React.ReactNode, FieldTypes>({
        order: 2,
        fieldType: 'textarea',
      }),
    ),
  title: z.string().check(fieldConfig({ order: 1 })),
  updated: z.date().optional(),
});

export const insertAnnouncementSchema = announcementSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateAnnouncementSchema = insertAnnouncementSchema.partial();
