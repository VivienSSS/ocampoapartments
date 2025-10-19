import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertTenantSchema,
  updateTenantSchema,
} from '../schemas/tenants';
import {
  Collections,
  type TenantsResponse as TenantsClientResponse,
  type UsersRecord,
} from '../types';

export type TenantsResponse = TenantsClientResponse<{ user: UsersRecord }>;

export const listTenantsQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Tenants, page, perPage],
    queryFn: () =>
      pb
        .collection(Collections.Tenants)
        .getList<TenantsResponse>(page, perPage, { expand: 'user' }),
  });

export const viewTenantQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Tenants, id],
    queryFn: () =>
      pb.collection(Collections.Tenants).getOne<TenantsResponse>(id, {
        expand: 'user',
      }),
  });

export const getCurrentTenantQuery = (userId: string) =>
  queryOptions({
    queryKey: [Collections.Tenants, 'current', userId],
    queryFn: async () => {
      const result = await pb.collection(Collections.Tenants).getFullList<TenantsResponse>({
        filter: `user = '${userId}'`,
        expand: 'user',
      });
      if (result.length === 0) {
        throw new Error('Tenant not found for current user');
      }
      return result[0];
    },
  });

export const inTenantsQuery = (selected: string[]) =>
  queryOptions({
    queryKey: [Collections.Tenants, selected],
    queryFn: () =>
      pb
        .collection<TenantsResponse>(Collections.Tenants)
        .getFullList({
          filter: selected.map((id) => `id='${id}'`).join('||'),
          expand: 'user',
          requestKey: null,
        }),
  });

export const createTenantMutation = mutationOptions<
  TenantsResponse,
  ClientResponseError,
  z.infer<typeof insertTenantSchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.Tenants).create<TenantsResponse>(value, {
      expand: 'user',
    }),
  onSuccess: (value) =>
    toast.success(`Successfully created`, {
      description: `Tenant created: ${value.expand.user.firstName} ${value.expand.user.lastName}`,
    }),
  onError: (err) =>
    toast.error(`An Error occured when creating a tenant`, {
      description: err.message,
    }),
});

export const updateTenantMutation = (id: string) =>
  mutationOptions<
    TenantsResponse,
    ClientResponseError,
    z.infer<typeof updateTenantSchema>
  >({
    mutationFn: async (value) =>
      pb.collection(Collections.Tenants).update<TenantsResponse>(id, value, {
        expand: 'user',
      }),
    onSuccess: (value) =>
      toast.success(`Changes saved`, {
        description: `Tenant ${value.expand.user.firstName} ${value.expand.user.lastName} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when updating the tenant ${id}`, {
        description: err.message,
      }),
  });

export const deleteTenantMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Tenants).delete(id),
    onSuccess: () =>
      toast.success(`Deleted sucessfully`, {
        description: `Tenant ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when deleting the tenant ${id}`, {
        description: err.message,
      }),
  });

export const batchDeleteTenantMutation = (selected: string[]) =>
  mutationOptions({
    mutationFn: async () => {
      const batch = pb.createBatch();

      for (const id of selected) {
        batch.collection(Collections.Tenants).delete(id);
      }

      return await batch.send({ requestKey: null });
    },
    onSuccess: () =>
      toast.success(`Deleted successfully`, {
        description: `Tenants ${selected.join(', ')} have been deleted successfully`,
      }),
    onError: (err) =>
      toast.error(`An error occurred when deleting the tenants`, {
        description: `Tenants: ${selected.join(', ')}\n${err.message}`,
      }),
  });
