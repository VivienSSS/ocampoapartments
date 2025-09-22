import z from 'zod';

export const tenanciesSchema = z.object({
  created: z.date().optional(),
  id: z.string(),
  leaseEndDate: z.date(),
  leaseStartDate: z.date(),
  tenant: z.string(),
  unit: z.string(),
  updated: z.date().optional(),
});

export const insertTenanciesSchema = tenanciesSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateTenanciesSchema = insertTenanciesSchema.partial();
