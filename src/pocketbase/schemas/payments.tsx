import z from 'zod';
import { PaymentsPaymentMethodOptions } from '../types';

export const paymentSchema = z.object({
  amountPaid: z.number(),
  bill: z.string(),
  created: z.date().optional(),
  id: z.string(),
  paymentDate: z.date(),
  paymentMethod: z.enum(PaymentsPaymentMethodOptions).default(PaymentsPaymentMethodOptions.GCash),
  screenshot: z.url(),
  tenant: z.string(),
  transactionId: z.string(),
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
    screenshot: z.file(),
  });

export const updatePaymentSchema = insertPaymentSchema.partial();
