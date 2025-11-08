import { fieldConfig } from '@autoform/zod';
import z from 'zod';
import { PropertiesBranchOptions } from '../types';

export const propertySchema = z.object({
  address: z
    .string()
    .check(
      fieldConfig({
        label: 'Building Address',
        description: 'The building address',
      }),
    ),
  branch: z
    .enum(PropertiesBranchOptions)
    .check(
      fieldConfig({
        label: 'Building Branch',
        description: 'The building branch',
      }),
    ),
  id: z.string(),
  created: z.date().optional(),
  updated: z.date().optional(),
});

export const insertPropertySchema = propertySchema.pick({
  address: true,
  branch: true,
});

export const updatePropertySchema = insertPropertySchema.partial();
