import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertMaintenanceRequestSchema,
  updateMaintenanceRequestSchema,
} from '../schemas/maintenanceRequests';
import {
  Collections,
  type HighPriorityUnresolvedRequestsStatCardKpiViewResponse,
  type MaintenanceOperationStatCardKpiViewResponse,
  type MaintenanceRequestOverviewStatCardKpiViewResponse,
  type MaintenanceRequestStatusStatCardKpiViewResponse,
  type MaintenanceRequestsResponse as MaintenanceRequestsClientResponse,
  type MaintenanceWorkersRecord,
} from '../types';
import type { ApartmentUnitsResponse } from './apartmentUnits';
import type { TenantsResponse } from './tenants';

export type MaintenanceRequestsResponse = MaintenanceRequestsClientResponse<{
  tenant: TenantsResponse;
  unit: ApartmentUnitsResponse;
  worker: MaintenanceWorkersRecord;
}>;

export const listMaintenanceRequestsQuery = (
  page: number,
  perPage: number,
  sort?: string,
  tenantFilter?: string,
) =>
  queryOptions({
    queryKey: [
      Collections.MaintenanceRequests,
      page,
      perPage,
      sort,
      tenantFilter,
    ],
    queryFn: () =>
      pb
        .collection(Collections.MaintenanceRequests)
        .getList<MaintenanceRequestsResponse>(page, perPage, {
          expand: 'tenant.user,unit,worker',
          fields: '*,description:excerpt(25,true)',
          sort,
          filter: tenantFilter,
        }),
  });

export const viewMaintenanceRequestQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.MaintenanceRequests, id],
    queryFn: () =>
      pb
        .collection<MaintenanceRequestsResponse>(
          Collections.MaintenanceRequests,
        )
        .getOne(id, { expand: 'tenant.user,unit,worker' }),
  });

export const createMaintenanceRequestMutation = mutationOptions<
  MaintenanceRequestsResponse,
  ClientResponseError,
  z.infer<typeof insertMaintenanceRequestSchema>
>({
  mutationFn: async (value) =>
    pb
      .collection(Collections.MaintenanceRequests)
      .create<MaintenanceRequestsResponse>(value, {
        expand: 'tenant.user,unit,worker',
      }),
  onSuccess: (value) =>
    toast.success(`Successfully Created`, {
      description: `Maintenance Request created: ${value.id}`,
    }),
  onError: (err) =>
    toast.error(`An error occured when creating a maintenance request`, {
      description: err.message,
    }),
});

export const updateMaintenanceRequestMutation = (id: string) =>
  mutationOptions<
    MaintenanceRequestsResponse,
    ClientResponseError,
    z.infer<typeof updateMaintenanceRequestSchema>
  >({
    mutationFn: async (value) =>
      pb
        .collection<MaintenanceRequestsResponse>(
          Collections.MaintenanceRequests,
        )
        .update(id, value, { expand: 'tenant.user,unit,worker' }),
    onSuccess: (value) =>
      toast.success(`Changes Saved`, {
        description: `Maintenance Request ${value.id} has been updated`,
      }),
    onError: (err) =>
      toast.error(
        `An error occured when updating the maintenance request ${id}`,
        {
          description: err.message,
        },
      ),
  });

export const deleteMaintenanceRequestMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () =>
      pb.collection(Collections.MaintenanceRequests).delete(id),
    onSuccess: () =>
      toast.success(`Deleted Sucessfully`, {
        description: `Maintenance Request ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(
        `An error occured when deleting the maintenance request ${id}`,
        {
          description: err.message,
        },
      ),
  });

export const inMaintenanceRequestsQuery = (selected: string[]) =>
  queryOptions({
    queryKey: [Collections.MaintenanceRequests, selected],
    queryFn: () =>
      pb
        .collection<MaintenanceRequestsResponse>(
          Collections.MaintenanceRequests,
        )
        .getFullList({
          filter: selected.map((id) => `id='${id}'`).join('||'),
          requestKey: null,
        }),
  });

export const batchDeleteMaintenanceRequestMutation = (selected: string[]) =>
  mutationOptions({
    mutationFn: async () => {
      const batch = pb.createBatch();

      for (const id of selected) {
        batch.collection(Collections.MaintenanceRequests).delete(id);
      }

      return await batch.send({ requestKey: null });
    },
    onSuccess: () =>
      toast.success(`Deleted Successfully`, {
        description: `Maintenance Requests ${selected.join(', ')} have been deleted successfully`,
      }),
    onError: (err) =>
      toast.error(`An error occurred when deleting the maintenance requests`, {
        description: `Maintenance Requests: ${selected.join(', ')}\n${err.message}`,
      }),
  });

// StatCard KPI Queries
export const maintenanceOperationStatCardKpiViewQuery = () =>
  queryOptions({
    queryKey: [Collections.MaintenanceOperationStatCardKpiView],
    queryFn: () =>
      pb
        .collection<MaintenanceOperationStatCardKpiViewResponse>(
          Collections.MaintenanceOperationStatCardKpiView,
        )
        .getFullList({ requestKey: null }),
  });

export const maintenanceRequestOverviewStatCardKpiViewQuery = () =>
  queryOptions({
    queryKey: [Collections.MaintenanceRequestOverviewStatCardKpiView],
    queryFn: () =>
      pb
        .collection<MaintenanceRequestOverviewStatCardKpiViewResponse>(
          Collections.MaintenanceRequestOverviewStatCardKpiView,
        )
        .getFullList({ requestKey: null }),
  });

export const maintenanceRequestStatusStatCardKpiViewQuery = () =>
  queryOptions({
    queryKey: [Collections.MaintenanceRequestStatusStatCardKpiView],
    queryFn: () =>
      pb
        .collection<MaintenanceRequestStatusStatCardKpiViewResponse>(
          Collections.MaintenanceRequestStatusStatCardKpiView,
        )
        .getFullList({ requestKey: null }),
  });

export const highPriorityUnresolvedRequestsStatCardKpiViewQuery = () =>
  queryOptions({
    queryKey: [Collections.HighPriorityUnresolvedRequestsStatCardKpiView],
    queryFn: () =>
      pb
        .collection<HighPriorityUnresolvedRequestsStatCardKpiViewResponse>(
          Collections.HighPriorityUnresolvedRequestsStatCardKpiView,
        )
        .getFullList({ requestKey: null }),
  });
