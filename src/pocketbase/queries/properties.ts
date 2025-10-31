import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertPropertySchema,
  updatePropertySchema,
} from '../schemas/properties';
import { Collections, type PropertiesResponse } from '../types';

export const listPropertiesQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Properties, page, perPage],
    queryFn: () => pb.collection(Collections.Properties).getList(page, perPage),
  });

export const viewPropertiesQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Properties, id],
    queryFn: () => pb.collection(Collections.Properties).getOne(id),
  });

export const inPropertiesQuery = (selected: string[]) =>
  queryOptions({
    queryKey: [Collections.Properties, selected],
    queryFn: () =>
      pb
        .collection<PropertiesResponse>(Collections.Properties)
        .getFullList({
          filter: selected.map((id) => `id='${id}'`).join('||'),
          requestKey: null,
        }),
  });

export const createPropertyMutation = mutationOptions<
  PropertiesResponse,
  ClientResponseError,
  z.infer<typeof insertPropertySchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.Properties).create(value),
  onSuccess: (value) =>
    toast.success(`Successfully Created`, {
      description: `New property added to the system: ${value.address}`,
    }),
  onError: (err) =>
    toast.error(`An error occured when creating the property`, {
      description: err.message,
    }),
});

export const updatePropertyMutation = (id: string) =>
  mutationOptions<
    PropertiesResponse,
    ClientResponseError,
    z.infer<typeof updatePropertySchema>
  >({
    mutationFn: async (value) =>
      pb.collection(Collections.Properties).update(id, value),
    onSuccess: (value) =>
      toast.success(`Changes Saved`, {
        description: `Property ${value.address} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An error occured when updating the property ${id}`, {
        description: err.message,
      }),
  });

export const deletePropertyMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Properties).delete(id),
    onSuccess: () =>
      toast.success(`Deleted Sucessfully`, {
        description: `Property ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An error occured when deleting the property ${id}`, {
        description: err.message,
      }),
  });

export const batchDeletePropertyMutation = (selected: string[]) =>
  mutationOptions({
    mutationFn: async () => {
      const batch = pb.createBatch();

      for (const id of selected) {
        batch.collection(Collections.Properties).delete(id);
      }

      return await batch.send({ requestKey: null });
    },
    onSuccess: () =>
      toast.success(`Deleted Successfully`, {
        description: `Properties ${selected.join(', ')} have been deleted successfully`,
      }),
    onError: (err) =>
      toast.error(`An error occurred when deleting the properties`, {
        description: `Properties: ${selected.join(', ')}\n${err.message}`,
      }),
  });
