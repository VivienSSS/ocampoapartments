import { fieldConfig } from '@autoform/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import z from 'zod';
import { listPropertiesQuery } from '../queries/properties';

export const apartmentUnitSchema = z.object({
  id: z.string(),
  capacity: z.coerce.number().optional(),
  floorNumber: z.coerce.number(),
  price: z.coerce.number().nonnegative().optional(),
  property: z.string().check(fieldConfig({
    inputProps: { name: 'property' },
    fieldType: 'relation',
    customData: {
      fieldData: () => {
        const { data } = useSuspenseQuery(listPropertiesQuery(1, 100))

        return data?.items.map(row => ({ label: ` ${row.address}`, value: row.id }))
      }
    },
    order: -1
  })),
  unitLetter: z.string().min(1).max(1),
  created: z.date().optional(),
  updated: z.date().optional(),
});

export const insertApartmentUnitSchema = apartmentUnitSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateApartmentUnitSchema = insertApartmentUnitSchema.partial();
