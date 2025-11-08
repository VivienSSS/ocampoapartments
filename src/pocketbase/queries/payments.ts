import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertPaymentSchema,
  updatePaymentSchema,
} from '../schemas/payments';
import {
  type BillsRecord,
  Collections,
  type MonthlyRevenueTrendStatCardKpiViewResponse,
  type PaymentMethodsDistributionChartViewResponse,
  type PaymentsResponse as PaymentsClientResponse,
  type PorfolioStatCardKpiViewResponse,
} from '../types';
import type { TenantsResponse } from './tenants';

export type PaymentsResponse = PaymentsClientResponse<{
  bill: BillsRecord;
  tenant: TenantsResponse;
}>;

export const listPaymentsQuery = (
  page: number,
  perPage: number,
  sort?: string,
) =>
  queryOptions({
    queryKey: [Collections.Payments, page, perPage, sort],
    queryFn: () =>
      pb
        .collection<PaymentsResponse>(Collections.Payments)
        .getList(page, perPage, {
          expand: 'bill,tenant.user',
          sort,
        }),
  });

export const viewPaymentQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Payments, id],
    queryFn: () =>
      pb.collection<PaymentsResponse>(Collections.Payments).getOne(id, {
        expand: 'bill,tenant',
      }),
  });

export const createPaymentMutation = mutationOptions<
  PaymentsResponse,
  ClientResponseError,
  z.infer<typeof insertPaymentSchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.Payments).create<PaymentsResponse>(value, {
      expand: 'bill,tenant',
    }),
  onSuccess: (value) =>
    toast.success(`Successfully Created`, {
      description: `Payment recorded: ${value.transactionId}`,
    }),
  onError: (err) =>
    toast.error(`An error occured when creating a payment`, {
      description: err.message,
    }),
});

export const updatePaymentMutation = (id: string) =>
  mutationOptions<
    PaymentsResponse,
    ClientResponseError,
    z.infer<typeof updatePaymentSchema>
  >({
    mutationFn: async (value) =>
      pb.collection(Collections.Payments).update<PaymentsResponse>(id, value, {
        expand: 'bill,tenant',
      }),
    onSuccess: (value) =>
      toast.success(`Changes Saved`, {
        description: `Payment ${value.transactionId} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An error occured when updating the payment ${id}`, {
        description: err.message,
      }),
  });

export const deletePaymentMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Payments).delete(id),
    onSuccess: () =>
      toast.success(`Deleted Sucessfully`, {
        description: `Payment ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An error occured when deleting the payment ${id}`, {
        description: err.message,
      }),
  });

// StatCard KPI & ChartView Queries
export const porfolioStatCardKpiViewQuery = () =>
  queryOptions({
    queryKey: [Collections.PorfolioStatCardKpiView],
    queryFn: () =>
      pb
        .collection<PorfolioStatCardKpiViewResponse>(
          Collections.PorfolioStatCardKpiView,
        )
        .getFullList({ requestKey: null }),
  });

export const monthlyRevenueTrendStatCardKpiViewQuery = () =>
  queryOptions({
    queryKey: [Collections.MonthlyRevenueTrendStatCardKpiView],
    queryFn: () =>
      pb
        .collection<MonthlyRevenueTrendStatCardKpiViewResponse>(
          Collections.MonthlyRevenueTrendStatCardKpiView,
        )
        .getFullList({ requestKey: null }),
  });

export const paymentMethodsDistributionChartViewQuery = () =>
  queryOptions({
    queryKey: [Collections.PaymentMethodsDistributionChartView],
    queryFn: () =>
      pb
        .collection<PaymentMethodsDistributionChartViewResponse>(
          Collections.PaymentMethodsDistributionChartView,
        )
        .getFullList({ requestKey: null }),
  });
