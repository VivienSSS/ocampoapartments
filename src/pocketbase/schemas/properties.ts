import { fieldConfig } from '@autoform/zod';
import z from 'zod';
import { PropertiesBranchOptions } from '../types';

export const propertySchema = z.object({
  address: z
    .string()
    .nonempty('Address is required')
    .check(
      fieldConfig({
        label: 'Building Address',
        description: 'The building address',
      }),
    ),
  branch: z
    .enum(PropertiesBranchOptions, { message: 'Please select a valid branch' })
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
