import z from 'zod';
import {
  MaintenanceRequestsStatusOptions,
  MaintenanceRequestsUrgencyOptions,
} from '../types';

export const maintenanceRequestSchema = z.object({
  completedDate: z.date().optional(),
  created: z.date().optional(),
  description: z.string(),
  id: z.string(),
  status: z.enum(MaintenanceRequestsStatusOptions).optional(),
  submittedDate: z.date().optional(),
  tenant: z.string(),
  unit: z.string(),
  updated: z.date().optional(),
  urgency: z.enum(MaintenanceRequestsUrgencyOptions),
  worker: z.string().optional(),
});

export const insertMaintenanceRequestSchema = maintenanceRequestSchema.omit({
  id: true,
  created: true,
  updated: true,
  // progressImage: true,
});
// .extend({
//   progressImage: z.array(z.file()),
// });

export const updateMaintenanceRequestSchema =
  insertMaintenanceRequestSchema.partial();
