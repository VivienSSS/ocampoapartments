import z from "zod";

export const tenantSchema = z.object({
  created: z.date().optional(),
  facebookName: z.string(),
  id: z.string(),
  phoneNumber: z.string().optional(),
  updated: z.date().optional(),
  user: z.string(),
});

export const insertTenantSchema = tenantSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateTenantSchema = insertTenantSchema.partial();
