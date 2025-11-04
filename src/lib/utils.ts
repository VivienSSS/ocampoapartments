import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function searchParams(resourceFields: z.ZodEnum) {
  return z.object({
    page: z.number().nonnegative().min(1).default(1).catch(1),
    perPage: z.number().nonnegative().default(5).catch(5),
    id: z.string().optional(),
    new: z.boolean().optional(),
    edit: z.boolean().optional(),
    delete: z.boolean().optional(),
    deactivate: z.boolean().optional(),
    selected: z.string().array().default([]),
    sort: z
      .array(z.object({ field: resourceFields, order: z.enum(['-', '+']) }))
      .optional(),
  });
}
