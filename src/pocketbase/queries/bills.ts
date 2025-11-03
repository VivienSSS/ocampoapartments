import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type { insertBillSchema, updateBillSchema } from '../schemas/bills';
import {
  type BillsResponse as BillsClientResponse,
  type BillsByStatusChartViewResponse,
  type BillItemAnalysisStatCardKpiViewResponse,
  type FinancialStatCardKpiViewResponse,
  Collections,
} from '../types';
import type { TenanciesResponse } from './tenancies';

export type BillsResponse = BillsClientResponse<{
  tenancy: TenanciesResponse;
}>;

export const listBillsQuery = (page: number, perPage: number, sort?: string) =>
  queryOptions({
    queryKey: [Collections.Bills, page, perPage, sort],
    queryFn: () =>
      pb.collection<BillsResponse>(Collections.Bills).getList(page, perPage, {
        expand: 'tenancy.tenant.user,tenancy.tenant.unit',
        sort,
      }),
  });

export const inBillsQuery = (selected: string[]) => queryOptions({
  queryKey: [Collections.Bills, selected],
  queryFn: () =>
    pb
      .collection<BillsResponse>(Collections.Bills)
      .getFullList({
        filter: selected.map((id) => `id='${id}'`).join("||"),
        expand: 'tenancy.tenant.user,tenancy.tenant.unit',
        requestKey: null
      }),
});

export const viewBillQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Bills, id],
    queryFn: () =>
      pb.collection<BillsResponse>(Collections.Bills).getOne(id, {
        expand: 'tenancy.tenant.user,tenancy.tenant.unit',
      }),
  });

export const createBillMutation = mutationOptions<
  BillsResponse,
  ClientResponseError,
  z.infer<typeof insertBillSchema>
>({
  mutationFn: async (value) => {
    const { items, ...bill } = value;

    const billRecord = await pb
      .collection(Collections.Bills)
      .create<BillsResponse>(bill, {
        expand: 'tenancy.tenant.user,tenancy.tenant.unit',
      });

    for (const item of items) {
      const billItem = { bill: billRecord.id, ...item };

      await pb.collection(Collections.BillItems).create(billItem);
    }

    return billRecord;
  },
  onSuccess: (value) =>
    toast.success(`Successfully Created`, {
      description: `Bill created for tenancy: ${value.tenancy}`,
    }),
  onError: (err) =>
    toast.error(`An error occured when creating a bill`, {
      description: err.message,
    }),
});

export const updateBillMutation = (id: string) =>
  mutationOptions<
    BillsResponse,
    ClientResponseError,
    z.infer<typeof updateBillSchema>
  >({
    mutationFn: async (value) =>
      pb.collection(Collections.Bills).update<BillsResponse>(id, value, {
        expand: 'tenancy.tenant.user,tenancy.tenant.unit',
      }),
    onSuccess: (value) =>
      toast.success(`Changes Saved`, {
        description: `Bill ${value.id} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An error occured when updating the bill ${id}`, {
        description: err.message,
      }),
  });

export const deleteBillMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Bills).delete(id),
    onSuccess: () =>
      toast.success(`Deleted Sucessfully`, {
        description: `Bill ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An error occured when deleting the bill ${id}`, {
        description: err.message,
      }),
  });

export const batchDeleteBillMutation = (selected: string[]) =>
  mutationOptions({
    mutationFn: async () => {
      const batch = pb.createBatch();

      for (const id of selected) {
        batch.collection(Collections.Bills).delete(id);
      }

      return await batch.send({ requestKey: null });
    },
    onSuccess: () =>
      toast.success(`Deleted Successfully`, {
        description: `Bills ${selected.join(', ')} have been deleted successfully`,
      }),
    onError: (err) =>
      toast.error(`An error occurred when deleting the bills`, {
        description: `Bills: ${selected.join(', ')}\n${err.message}`,
      }),
  });

// StatCard KPI Queries
export const billsByStatusChartViewQuery = () =>
  queryOptions({
    queryKey: [Collections.BillsByStatusChartView],
    queryFn: () =>
      pb
        .collection<BillsByStatusChartViewResponse>(
          Collections.BillsByStatusChartView
        )
        .getFullList({ requestKey: null }),
  });

export const billItemAnalysisStatCardKpiViewQuery = () =>
  queryOptions({
    queryKey: [Collections.BillItemAnalysisStatCardKpiView],
    queryFn: () =>
      pb
        .collection<BillItemAnalysisStatCardKpiViewResponse>(
          Collections.BillItemAnalysisStatCardKpiView
        )
        .getFullList({ requestKey: null }),
  });

export const financialStatCardKpiViewQuery = () =>
  queryOptions({
    queryKey: [Collections.FinancialStatCardKpiView],
    queryFn: () =>
      pb
        .collection<FinancialStatCardKpiViewResponse>(
          Collections.FinancialStatCardKpiView
        )
        .getFullList({ requestKey: null }),
  });
