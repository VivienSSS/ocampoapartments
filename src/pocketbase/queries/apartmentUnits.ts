import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertApartmentUnitSchema,
  updateApartmentUnitSchema,
} from '../schemas/apartmentUnits';
import {
  type ApartmentUnitsResponse as ApartmentUnitsClientResponse,
  Collections,
  type PropertiesRecord,
} from '../types';

export type ApartmentUnitsResponse = ApartmentUnitsClientResponse<{
  property: PropertiesRecord;
}>;

export const listApartmentUnitsQuery = (page: number, perPage: number, sort?: string) =>
  queryOptions({
    queryKey: [Collections.ApartmentUnits, page, perPage, sort],
    queryFn: () =>
      pb
        .collection<ApartmentUnitsResponse>(Collections.ApartmentUnits)
        .getList(page, perPage, {
          expand: 'property',
          sort,
        }),
  });

export const viewApartmentUnitQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.ApartmentUnits, id],
    queryFn: () =>
      pb
        .collection<ApartmentUnitsResponse>(Collections.ApartmentUnits)
        .getOne(id, {
          expand: 'property',
        }),
  });

export const createApartmentUnitMutation = mutationOptions<
  ApartmentUnitsResponse,
  ClientResponseError,
  z.infer<typeof insertApartmentUnitSchema>
>({
  mutationFn: async (value) =>
    pb
      .collection(Collections.ApartmentUnits)
      .create<ApartmentUnitsResponse>(value, {
        expand: 'property',
      }),
  onSuccess: (value) =>
    toast.success(`Successfully Created`, {
      description: `Apartment Unit ${value.unitLetter} added`,
    }),
  onError: (err) =>
    toast.error(`An error occured when creating the apartment unit`, {
      description: err.message,
    }),
});

export const updateApartmentUnitMutation = (id: string) =>
  mutationOptions<
    ApartmentUnitsResponse,
    ClientResponseError,
    z.infer<typeof updateApartmentUnitSchema>
  >({
    mutationFn: async (value) =>
      pb
        .collection(Collections.ApartmentUnits)
        .update<ApartmentUnitsResponse>(id, value, {
          expand: 'property',
        }),
    onSuccess: (value) =>
      toast.success(`Changes Saved`, {
        description: `Apartment Unit ${value.unitLetter} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An error occured when updating the apartment unit ${id}`, {
        description: err.message,
      }),
  });

export const inApartmentUnitsQuery = (selected: string[]) =>
  queryOptions({
    queryKey: [Collections.ApartmentUnits, selected],
    queryFn: () =>
      pb
        .collection<ApartmentUnitsResponse>(Collections.ApartmentUnits)
        .getFullList({
          filter: selected.map((id) => `id='${id}'`).join('||'),
          expand: 'property',
          requestKey: null,
        }),
  });

export const deleteApartmentUnitMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () =>
      pb.collection(Collections.ApartmentUnits).delete(id),
    onSuccess: () =>
      toast.success(`Deleted Sucessfully`, {
        description: `Apartment Unit ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An error occured when deleting the apartment unit ${id}`, {
        description: err.message,
      }),
  });

export const batchDeleteApartmentUnitMutation = (selected: string[]) =>
  mutationOptions({
    mutationFn: async () => {
      const batch = pb.createBatch();

      for (const id of selected) {
        batch.collection(Collections.ApartmentUnits).delete(id);
      }

      return await batch.send({ requestKey: null });
    },
    onSuccess: () =>
      toast.success(`Deleted Successfully`, {
        description: `Apartment Units ${selected.join(', ')} have been deleted successfully`,
      }),
    onError: (err) =>
      toast.error(`An error occurred when deleting the apartment units`, {
        description: `Apartment Units: ${selected.join(', ')}\n${err.message}`,
      }),
  });
