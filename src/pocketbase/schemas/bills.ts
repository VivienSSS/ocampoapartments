import { fieldConfig } from '@autoform/zod';
import z from 'zod';
import { BillsStatusOptions } from '../types';
import { insertBillItemsSchema } from './billItems';

export const billSchema = z.object({
  created: z.date().optional(),
  dueDate: z.date({ message: 'Due date is required' }),
  id: z.string(),
  status: z
    .enum(BillsStatusOptions, { message: 'Please select a valid status' })
    .check(fieldConfig({ label: 'Status' })),
  tenancy: z
    .string()
    .nonempty('Tenancy is required')
    .check(fieldConfig({ label: 'Tenant' })),
  updated: z.date().optional(),
});

export const insertBillSchema = billSchema
  .omit({
    id: true,
    created: true,
    updated: true,
  })
  .extend({
    items: z
      .array(insertBillItemsSchema)
      .check(
        fieldConfig({ label: 'Bill items', description: 'Amount to charge' }),
      ),
  });

export const updateBillSchema = insertBillSchema.partial();
