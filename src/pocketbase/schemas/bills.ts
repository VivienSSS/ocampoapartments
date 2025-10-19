import z from 'zod';
import { BillsStatusOptions } from '../types';
import { insertBillItemsSchema } from './billItems';
import { fieldConfig } from '@autoform/zod';

export const billSchema = z.object({
  created: z.date().optional(),
  dueDate: z.date().check(fieldConfig({ label: "Due Date" })),
  id: z.string(),
  status: z.enum(BillsStatusOptions).check(fieldConfig({ label: "Status" })),
  tenancy: z.string().check(fieldConfig({ label: "Tenant" })),
  updated: z.date().optional(),
});

export const insertBillSchema = billSchema
  .omit({
    id: true,
    created: true,
    updated: true,
  })
  .extend({ items: z.array(insertBillItemsSchema).check(fieldConfig({ label: "Bill items", description: "Amount to charge" })) });

export const updateBillSchema = insertBillSchema.partial();
