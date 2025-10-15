import z from 'zod';
import { PaymentsPaymentMethodOptions } from '../types';
import { fieldConfig } from '@autoform/zod';
import type { FieldWrapperProps } from '@autoform/react';
import { listBillsQuery } from '../queries/bills';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { listTenantsQuery } from '../queries/tenants';

export const paymentSchema = z.object({
  amountPaid: z.number().check(fieldConfig({
    order: 3
  })),
  bill: z.string().check(fieldConfig({
    fieldType: 'relation',
    customData: {
      fieldData: () => {
        const { data } = useSuspenseQuery(listBillsQuery(1, 100))
        return data?.items.map(row => ({ label: `${format(row.dueDate, 'PPP')} - ${row.expand.tenancy.expand.tenant.expand.user.firstName} ${row.expand.tenancy.expand.tenant.expand.user.lastName}`, value: row.id }))
      }
    },
    order: 2
  })),
  created: z.date().optional(),
  id: z.string(),
  paymentDate: z.date().check(fieldConfig({ order: 5 })),
  paymentMethod: z.enum(PaymentsPaymentMethodOptions).default(PaymentsPaymentMethodOptions.GCash).check(fieldConfig({ label: 'Payment method', inputProps: { disabled: true }, order: 4 })),
  screenshot: z.url(),
  tenant: z.string().check(fieldConfig({
    fieldType: 'relation',
    customData: {
      fieldData: () => {
        const { data } = useSuspenseQuery(listTenantsQuery(1, 100))

        return data?.items.map(row => ({ label: ` ${row.expand.user.firstName} ${row.expand.user.lastName}`, value: row.id }))
      }
    },
    order: 1
  })),
  transactionId: z.string().check(fieldConfig({ order: 6 })),
  updated: z.date().optional(),
});

export const insertPaymentSchema = paymentSchema
  .omit({
    id: true,
    created: true,
    updated: true,
    screenshot: true,
  })
  .extend({
    screenshot: z.file().check(fieldConfig({ label: "Screenshot", description: "Gcash Screenshot", fieldType: "file", order: 7 })),
  });

export const updatePaymentSchema = insertPaymentSchema.partial();
