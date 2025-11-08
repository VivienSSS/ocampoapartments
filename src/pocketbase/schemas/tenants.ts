import { fieldConfig } from '@autoform/zod';
import { useSuspenseQuery } from '@tanstack/react-query';
import z from 'zod';
import { listTenantsQuery } from '../queries/tenants';
import { listUserQuery } from '../queries/users';

export const tenantSchema = z.object({
  created: z.date().optional(),
  facebookName: z.string().check(fieldConfig({ order: 2 })),
  id: z.string(),
  phoneNumber: z.coerce.number().check(fieldConfig({ order: 3 })),
  updated: z.date().optional(),
  user: z.string().check(
    fieldConfig({
      fieldType: 'relation',
      label: 'Name',
      customData: {
        fieldData: () => {
          const { data } = useSuspenseQuery(listUserQuery(1, 100));

          return data?.items.map((row) => ({
            label: `${row.firstName} ${row.lastName}`,
            value: row.id,
          }));
        },
      },
      order: 1,
    }),
  ),
});

export const insertTenantSchema = tenantSchema.omit({
  id: true,
  created: true,
  updated: true,
});

export const updateTenantSchema = insertTenantSchema.partial();
