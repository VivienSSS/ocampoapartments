import z from 'zod';
import { PaymentsPaymentMethodOptions } from '../types';

export const paymentSchema = z.object({
  amountPaid: z
    .number({ message: 'Amount paid must be a number' })
    .positive('Amount paid must be greater than 0'),
  bill: z.string().nonempty('Bill is required'),
  created: z.date().optional(),
  id: z.string(),
  paymentDate: z.date({ message: 'Payment date is required' }),
  paymentMethod: z
    .enum(PaymentsPaymentMethodOptions, {
      message: 'Please select a valid payment method',
    })
    .default(PaymentsPaymentMethodOptions.GCash),
  screenshot: z.url('Please provide a valid URL for the screenshot'),
  tenant: z.string().nonempty('Tenant is required'),
  transactionId: z.string().nonempty('Transaction ID is required'),
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
