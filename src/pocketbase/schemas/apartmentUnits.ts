import { fieldConfig } from '@autoform/zod';
import z from 'zod';

export const apartmentUnitSchema = z.object({
  id: z.string(),
  capacity: z
    .number({ message: 'Capacity must be a number' })
    .int('Capacity must be a whole number')
    .positive('Capacity must be greater than 0')
    .check(fieldConfig({ order: 3 })),
  floorNumber: z
    .number({ message: 'Floor number must be a number' })
    .int('Floor number must be a whole number')
    .nonnegative('Floor number must be 0 or greater')
    .check(fieldConfig({ order: 2 })),
  price: z
    .number({ message: 'Price must be a number' })
    .nonnegative('Price must be a positive number')
    .check(fieldConfig({ order: 4 })),
  room_size: z
    .number({ message: 'Room size must be a number' })
    .positive('Room size must be greater than 0')
    .check(fieldConfig({ order: 5 })),
  property: z.string().nonempty('Property is required'),
  unitLetter: z
    .string()
    .nonempty('Unit letter is required')
    .min(1, 'Unit letter is required')
    .max(1, 'Unit letter must be a single character')
    .check(fieldConfig({ order: 3 })),
  isAvailable: z.boolean(),
  image: z
    .union([z.instanceof(File), z.string()])
    .optional()
    .check(fieldConfig({ order: 6 })),
  carousel_image: z
    .union([z.array(z.instanceof(File)), z.array(z.string())])
    .optional()
    .check(fieldConfig({ order: 7 })),
  created: z.date().optional(),
  updated: z.date().optional(),
});

export const insertApartmentUnitSchema = apartmentUnitSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateApartmentUnitSchema = insertApartmentUnitSchema.partial();
