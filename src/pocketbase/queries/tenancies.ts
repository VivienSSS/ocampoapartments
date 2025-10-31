import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertTenanciesSchema,
  updateTenanciesSchema,
} from '../schemas/tenancies';
import {
  Collections,
  type TenanciesResponse as TenanciesClientResponse,
} from '../types';
import type { ApartmentUnitsResponse } from './apartmentUnits';
import type { TenantsResponse } from './tenants';

export type TenanciesResponse = TenanciesClientResponse<{
  tenant: TenantsResponse;
  unit: ApartmentUnitsResponse;
}>;

export const listTenanciesQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Tenancies, page, perPage],
    queryFn: () =>
      pb
        .collection(Collections.Tenancies)
        .getList<TenanciesResponse>(page, perPage, {
          expand: 'tenant.user,unit.property',
        }),
  });

export const viewTenancyQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Tenancies, id],
    queryFn: () =>
      pb.collection(Collections.Tenancies).getOne<TenanciesResponse>(id, { expand: 'tenant.user,unit.property', }),
  });

export const createTenancyMutation = mutationOptions<
  TenanciesResponse,
  ClientResponseError,
  z.infer<typeof insertTenanciesSchema>
>({
  mutationFn: async (value) => {
    // Create the tenancy
    const tenancy = await pb.collection(Collections.Tenancies).create<TenanciesResponse>(value, { expand: 'tenant.user,unit.property', });

    // Update the apartment unit to mark it as unavailable
    await pb.collection(Collections.ApartmentUnits).update(value.unit, { isAvailable: false });

    return tenancy;
  },
  onSuccess: (value) =>
    toast.success(`Successfully Created`, {
      description: `Tenancy created: ${value.id}`,
    }),
  onError: (err) =>
    toast.error(`An Error occured when creating a tenancy`, {
      description: err.message,
    }),
});

export const updateTenancyMutation = (id: string) =>
  mutationOptions<
    TenanciesResponse,
    ClientResponseError,
    z.infer<typeof updateTenanciesSchema>
  >({
    mutationFn: async (value) => {
      // If the unit is being changed, we need to handle unit availability
      if (value.unit) {
        // Get the current tenancy to see if unit changed
        const currentTenancy = await pb.collection(Collections.Tenancies).getOne(id);

        if (currentTenancy.unit !== value.unit) {
          // Mark the old unit as available
          await pb.collection(Collections.ApartmentUnits).update(currentTenancy.unit, { isAvailable: true });
          // Mark the new unit as unavailable
          await pb.collection(Collections.ApartmentUnits).update(value.unit, { isAvailable: false });
        }
      }

      return pb.collection(Collections.Tenancies).update<TenanciesResponse>(id, value, { expand: 'tenant.user,unit.property', });
    },
    onSuccess: (value) =>
      toast.success(`Changes Saved`, {
        description: `Tenancy ${value.id} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An error occured when updating the tenancy ${id}`, {
        description: err.message,
      }),
  });

export const deleteTenancyMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => {
      // Get the tenancy details first to know which unit to mark as available
      const tenancy = await pb.collection(Collections.Tenancies).getOne(id);

      // Delete the tenancy
      await pb.collection(Collections.Tenancies).delete(id);

      // Mark the unit as available again
      await pb.collection(Collections.ApartmentUnits).update(tenancy.unit, { isAvailable: true });
    },
    onSuccess: () =>
      toast.success(`Deleted Sucessfully`, {
        description: `Tenancy ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An error occured when deleting the tenancy ${id}`, {
        description: err.message,
      }),
  });

export const inTenanciesQuery = (selected: string[]) => queryOptions({
  queryKey: [Collections.Tenancies, selected],
  queryFn: () =>
    pb
      .collection<TenanciesResponse>(Collections.Tenancies)
      .getFullList({ filter: selected.map((id) => `id='${id}'`).join("||"), expand: 'tenant.user,unit.property', requestKey: null }),
});

export const batchDeleteTenancyMutation = (selected: string[]) =>
  mutationOptions({
    mutationFn: async () => {
      // Get all tenancy details first to know which units to mark as available
      const tenancies = await pb
        .collection(Collections.Tenancies)
        .getFullList({ filter: selected.map((id) => `id='${id}'`).join("||"), requestKey: null });

      const batch = pb.createBatch();

      // Delete all tenancies
      for (const id of selected) {
        batch.collection(Collections.Tenancies).delete(id);
      }

      // Mark all associated units as available again
      for (const tenancy of tenancies) {
        batch.collection(Collections.ApartmentUnits).update(tenancy.unit, { isAvailable: true });
      }

      return await batch.send({ requestKey: null });
    },
    onSuccess: () =>
      toast.success(`Deleted Successfully`, {
        description: `Tenancies ${selected.join(', ')} have been deleted successfully`,
      }),
    onError: (err) =>
      toast.error(`An error occurred when deleting the tenancies`, {
        description: `Tenancies: ${selected.join(', ')}\n${err.message}`,
      }),
  });
