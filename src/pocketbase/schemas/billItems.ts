import z from 'zod';
import { BillItemsChargeTypeOptions } from '../types';

export const billItemsSchema = z.object({
  amount: z.number().nonnegative('Amount must be a positive number').optional(),
  bill: z.string().nonempty('Bill is required'),
  chargeType: z.enum(BillItemsChargeTypeOptions, {
    message: 'Please select a valid charge type',
  }),
  created: z.date().optional(),
  description: z.string().nonempty('Description is required'),
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
