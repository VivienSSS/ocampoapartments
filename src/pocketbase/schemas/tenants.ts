import z from 'zod';

export const tenantSchema = z.object({
  created: z.date().optional(),
  facebookName: z.string().nonempty('Facebook name is required'),
  id: z.string(),
  phoneNumber: z.string().nonempty('Phone number is required'),
  updated: z.date().optional(),
  user: z.string().nonempty('Tenant is required'),
});

export const insertTenantSchema = tenantSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateTenantSchema = insertTenantSchema.partial();
