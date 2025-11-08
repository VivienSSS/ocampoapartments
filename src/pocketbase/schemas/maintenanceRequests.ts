import z from 'zod';
import {
  MaintenanceRequestsStatusOptions,
  MaintenanceRequestsUrgencyOptions,
} from '../types';

export const maintenanceRequestSchema = z.object({
  completedDate: z.date().optional(),
  created: z.date().optional(),
  description: z.string().nonempty('Description is required'),
  id: z.string(),
  status: z
    .enum(MaintenanceRequestsStatusOptions, {
      message: 'Please select a valid status',
    })
    .optional(),
  submittedDate: z.date().optional(),
  tenant: z.string().nonempty('Tenant is required'),
  unit: z.string().nonempty('Unit is required'),
  updated: z.date().optional(),
  urgency: z.enum(MaintenanceRequestsUrgencyOptions, {
    message: 'Please select a valid urgency level',
  }),
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
