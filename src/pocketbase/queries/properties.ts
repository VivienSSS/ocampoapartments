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

export const createPropertyMutation = mutationOptions<
  PropertiesResponse,
  ClientResponseError,
  z.infer<typeof insertPropertySchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.Properties).create(value),
  onSuccess: (value) =>
    toast.success(`Successfully create`, {
      description: `New property added to the system: ${value.address}`,
    }),
  onError: (err) =>
    toast.error(`An Error occured when creating a property`, {
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
      toast.success(`Changes saved`, {
        description: `Property ${value.address} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when updating the property ${id}`, {
        description: err.message,
      }),
  });

export const deletePropertyMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Properties).delete(id),
    onSuccess: () =>
      toast.success(`Deleted sucessfully`, {
        description: `Property ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when deleting the property ${id}`, {
        description: err.message,
      }),
  });
