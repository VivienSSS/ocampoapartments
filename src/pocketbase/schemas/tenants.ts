import z from 'zod';

export const tenantSchema = z.object({
  created: z.date().optional(),
  email: z.email(),
  facebookName: z.string(),
  firstName: z.string(),
  id: z.string(),
  lastName: z.string(),
  phoneNumber: z.number().optional(),
  updated: z.date().optional(),
  user: z.string(),
});

export const insertTenantSchema = tenantSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateTenantSchema = insertTenantSchema.partial();
