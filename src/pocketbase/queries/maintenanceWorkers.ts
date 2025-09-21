import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertMaintenanceWorkerSchema,
  updateMaintenanceWorkerSchema,
} from '../schemas/maintenanceWorkers';
import { Collections, type MaintenanceWorkersResponse } from '../types';

export const listMaintenanceWorkersQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.MaintenanceWorkers, page, perPage],
    queryFn: () =>
      pb.collection(Collections.MaintenanceWorkers).getList(page, perPage),
  });

export const viewMaintenanceWorkerQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.MaintenanceWorkers, id],
    queryFn: () => pb.collection(Collections.MaintenanceWorkers).getOne(id),
  });

export const createMaintenanceWorkerMutation = mutationOptions<
  MaintenanceWorkersResponse,
  ClientResponseError,
  z.infer<typeof insertMaintenanceWorkerSchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.MaintenanceWorkers).create(value),
  onSuccess: (value) =>
    toast.success(`Successfully create`, {
      description: `Maintenance worker ${value.name} added`,
    }),
  onError: (err) =>
    toast.error(`An Error occured when creating a maintenance worker`, {
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
      toast.success(`Changes saved`, {
        description: `Maintenance worker ${value.name} has been updated`,
      }),
    onError: (err) =>
      toast.error(
        `An Error occured when updating the maintenance worker ${id}`,
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
      toast.success(`Deleted sucessfully`, {
        description: `Maintenance worker ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(
        `An Error occured when deleting the maintenance worker ${id}`,
        {
          description: err.message,
        },
      ),
  });
