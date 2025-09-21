import z from 'zod';
import { PropertiesBranchOptions } from '../types';

export const propertySchema = z.object({
  address: z.string(),
  branch: z.enum(PropertiesBranchOptions),
  id: z.string(),
  created: z.date().optional(),
  updated: z.date().optional(),
});

export const insertPropertySchema = propertySchema.pick({
  address: true,
  branch: true,
});

export const updatePropertySchema = insertPropertySchema.partial();
