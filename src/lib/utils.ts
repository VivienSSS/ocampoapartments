import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import z from 'zod';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function searchParams(resourceFields: z.ZodEnum) {
  return z.object({
    page: z.number().nonnegative().default(1).catch(1),
    perPage: z.number().nonnegative().default(10).catch(10),
    id: z.string().optional(),
    new: z.boolean().optional(),
    edit: z.boolean().optional(),
    delete: z.boolean().optional(),
    sort: z
      .array(z.object({ field: resourceFields, order: z.enum(['-', '+']) }))
      .optional(),
  });
}
