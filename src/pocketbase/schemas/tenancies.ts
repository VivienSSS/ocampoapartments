import { fieldConfig } from '@autoform/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import z from 'zod';
import { listApartmentUnitsQuery } from '../queries/apartmentUnits';
import { listTenantsQuery } from '../queries/tenants';

export const tenanciesSchema = z.object({
  created: z.date().optional(),
  id: z.string(),
  leaseEndDate: z.date(),
  leaseStartDate: z.date(),
  tenant: z.string().check(
    fieldConfig({
      fieldType: 'relation',
      customData: {
        fieldData: () => {
          const { data } = useSuspenseQuery(listTenantsQuery(1, 100));

          return data?.items.map((row) => ({
            label:
              `${(row.expand as any)?.user?.firstName || ''} ${(row.expand as any)?.user?.lastName || ''}`.trim() ||
              `Tenant #${row.id.slice(-6)}`,
            value: row.id,
          }));
        },
      },
      order: 1,
    }),
  ),
  unit: z.string().check(
    fieldConfig({
      fieldType: 'relation',
      customData: {
        fieldData: () => {
          const { data } = useSuspenseQuery(listApartmentUnitsQuery(1, 100));

          return data?.items
            .filter((row) => row.isAvailable) // Only show available units
            .map((row) => ({
              label: `${(row.expand as any)?.property?.branch || 'Unknown Property'} - Floor ${row.floorNumber} - Unit ${row.unitLetter}`,
              value: row.id,
            }));
        },
      },
      order: 2,
    }),
  ),
  updated: z.date().optional(),
});

export const insertTenanciesSchema = tenanciesSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateTenanciesSchema = insertTenanciesSchema.partial();
