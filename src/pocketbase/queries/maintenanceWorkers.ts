import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertMaintenanceWorkerSchema,
  updateMaintenanceWorkerSchema,
} from '../schemas/maintenanceWorkers';
import {
  Collections,
  type MaintenanceWorkersResponse,
  type WorkerPerformanceChartViewResponse,
} from '../types';

export const listMaintenanceWorkersQuery = (page: number, perPage: number, sort?: string) =>
  queryOptions({
    queryKey: [Collections.MaintenanceWorkers, page, perPage, sort],
    queryFn: () =>
      pb.collection(Collections.MaintenanceWorkers).getList(page, perPage, { sort }),
  });

export const viewMaintenanceWorkerQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.MaintenanceWorkers, id],
    queryFn: () => pb.collection(Collections.MaintenanceWorkers).getOne(id),
  });

export const inMaintenanceWorkersQuery = (ids: string[]) =>
  queryOptions({
    queryKey: [Collections.MaintenanceWorkers, 'in', ids],
    queryFn: () =>
      pb
        .collection(Collections.MaintenanceWorkers)
        .getFullList({ filter: `id ~ "${ids.join('", "')}"`, requestKey: null }),
  });

export const createMaintenanceWorkerMutation = mutationOptions<
  MaintenanceWorkersResponse,
  ClientResponseError,
  z.infer<typeof insertMaintenanceWorkerSchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.MaintenanceWorkers).create(value),
  onSuccess: (value) =>
    toast.success(`Successfully Created`, {
      description: `Maintenance Worker ${value.name} added`,
    }),
  onError: (err) =>
    toast.error(`An error occured when creating a maintenance worker`, {
      description: err.message,
    }),
});

export const updateMaintenanceWorkerMutation = (id: string) =>
  mutationOptions<
    MaintenanceWorkersResponse,
    ClientResponseError,
    z.infer<typeof updateMaintenanceWorkerSchema>
  >({
    mutationFn: async (value) =>
      pb.collection(Collections.MaintenanceWorkers).update(id, value),
    onSuccess: (value) =>
      toast.success(`Changes Saved`, {
        description: `Maintenance Worker ${value.name} has been updated`,
      }),
    onError: (err) =>
      toast.error(
        `An error occured when updating the maintenance worker ${id}`,
        {
          description: err.message,
        },
      ),
  });

export const deleteMaintenanceWorkerMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () =>
      pb.collection(Collections.MaintenanceWorkers).delete(id),
    onSuccess: () =>
      toast.success(`Deleted Sucessfully`, {
        description: `Maintenance Worker ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(
        `An error occured when deleting the maintenance worker ${id}`,
        {
          description: err.message,
        },
      ),
  });

export const batchDeleteMaintenanceWorkerMutation = (selected: string[]) =>
  mutationOptions({
    mutationFn: async () => {
      const batch = pb.createBatch();

      for (const id of selected) {
        batch.collection(Collections.MaintenanceWorkers).delete(id);
      }

      return await batch.send({ requestKey: null });
    },
    onSuccess: () =>
      toast.success(`Deleted Successfully`, {
        description: `Maintenance Workers ${selected.join(', ')} have been deleted successfully`,
      }),
    onError: (err) =>
      toast.error(`An error occurred when deleting the maintenance workers`, {
        description: `Maintenance Workers: ${selected.join(', ')}\n${err.message}`,
      }),
  });

// ChartView Queries
export const workerPerformanceChartViewQuery = () =>
  queryOptions({
    queryKey: [Collections.WorkerPerformanceChartView],
    queryFn: () =>
      pb
        .collection<WorkerPerformanceChartViewResponse>(
          Collections.WorkerPerformanceChartView
        )
        .getFullList({ requestKey: null }),
  });

