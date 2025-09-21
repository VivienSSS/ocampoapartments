import z from 'zod';

export const authOriginsSchema = z.object({
  collectionRef: z.string(),
  created: z.date().optional(),
  fingerprint: z.string(),
  id: z.string(),
  recordRef: z.string(),
  updated: z.date().optional(),
});

export const insertAuthOriginsSchema = authOriginsSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateAuthOriginsSchema = insertAuthOriginsSchema.partial();
