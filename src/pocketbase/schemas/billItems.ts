import z from 'zod';
import { BillItemsChargeTypeOptions } from '../types';
import { fieldConfig } from '@autoform/zod';
import type { FieldTypes } from '@/components/ui/autoform';
import type React from 'react';

export const billItemsSchema = z.object({
  amount: z.number().nonnegative().optional().check(fieldConfig({ label: "Amount", description: "Amount to charge", order: 2 })),
  bill: z.string(),
  chargeType: z.enum(BillItemsChargeTypeOptions).check(fieldConfig({ order: 1 })),
  created: z.date().optional(),
  description: z.string().check(fieldConfig<React.ReactNode, FieldTypes>({ order: 3, fieldType: 'textarea' })),
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
