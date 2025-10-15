import z from 'zod';
import { BillItemsChargeTypeOptions } from '../types';
import { fieldConfig } from '@autoform/zod';

export const billItemsSchema = z.object({
  amount: z.number().nonnegative().optional().check(fieldConfig({ label: "Amount", description: "Amount to charge" })),
  bill: z.string(),
  chargeType: z.enum(BillItemsChargeTypeOptions),
  created: z.date().optional(),
  description: z.string(),
  id: z.string(),
  updated: z.date().optional(),
});

export const insertBillItemsSchema = billItemsSchema.omit({
  id: true,
  created: true,
  updated: true,
  bill: true,
});

export const updateBillItemsSchema = insertBillItemsSchema.partial();
