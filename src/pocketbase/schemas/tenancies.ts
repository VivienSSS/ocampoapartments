import z from 'zod';

export const tenanciesSchema = z.object({
  created: z.date().optional(),
  id: z.string(),
  leaseEndDate: z.date({ message: 'Lease end date is required' }),
  leaseStartDate: z.date({ message: 'Lease start date is required' }),
  tenant: z.string().nonempty('Tenant is required'),
  unit: z.string().nonempty('Unit is required'),
  updated: z.date().optional(),
});

export const insertTenanciesSchema = tenanciesSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateTenanciesSchema = insertTenanciesSchema.partial();
