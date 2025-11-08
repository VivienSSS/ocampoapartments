import z from 'zod';

export const maintenanceWorkerSchema = z.object({
  contactDetails: z.string().nonempty('Contact details are required'),
  created: z.date().optional(),
  id: z.string(),
  isAvailable: z.boolean().default(true),
  name: z
    .string()
    .nonempty('Name is required')
    .min(3, 'Name must be at least 3 characters long')
    .max(255, 'Name must not exceed 255 characters'),
  updated: z.date().optional(),
});

export const insertMaintenanceWorkerSchema = maintenanceWorkerSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateMaintenanceWorkerSchema =
  insertMaintenanceWorkerSchema.partial();
