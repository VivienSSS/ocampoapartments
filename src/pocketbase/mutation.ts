import { mutationOptions } from '@tanstack/react-query';
import type { Collections, Create, TypedPocketBase, Update } from './types';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';

export const CreateRecordMutationOption = <C extends Collections>(
  pocketbase: TypedPocketBase,
  collection: C,
  data: Create<C>,
) =>
  mutationOptions({
    mutationKey: [collection, 'create', data],
    mutationFn: async () => {
      return await pocketbase.collection(collection).create(data);
    },
    onError: (error: ClientResponseError) => {
      toast.error(`Error creating record: ${error.message}`, {
        description: error.data?.message,
      });
    },
    onSuccess: (data) => {
      toast.success(`Record at ${collection} created successfully`, {
        description: `Record ID: ${data.id}`,
      });
    },
  });

export const UpdateRecordMutationOption = <C extends Collections>(
  pocketbase: TypedPocketBase,
  collection: C,
  id: string,
  data: Update<C>,
) =>
  mutationOptions({
    mutationKey: [collection, 'update', id, data],
    mutationFn: async () => {
      return await pocketbase.collection(collection).update(id, data);
    },
    onError: (error: ClientResponseError) => {
      toast.error(`Error updating record: ${error.message}`, {
        description: error.data?.message,
      });
    },
    onSuccess: (data) => {
      toast.success(`Record at ${collection} updated successfully`, {
        description: `Record ID: ${data.id}`,
      });
    },
  });

export const DeleteRecordMutationOption = <C extends Collections>(
  pocketbase: TypedPocketBase,
  collection: C,
  id: string,
) =>
  mutationOptions({
    mutationKey: [collection, 'delete', id],
    mutationFn: async () => {
      return await pocketbase.collection(collection).delete(id);
    },
    onError: (error: ClientResponseError) => {
      toast.error(`Error deleting record: ${error.message}`, {
        description: error.data?.message,
      });
    },
    onSuccess: () => {
      toast.success(`Record at ${collection} deleted successfully`);
    },
  });
