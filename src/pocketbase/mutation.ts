import { mutationOptions } from '@tanstack/react-query';
import type {
  CollectionResponses,
  Collections,
  Create,
  TypedPocketBase,
  Update,
} from './types';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';

export const CreateRecordMutationOption = <C extends Collections>(
  pocketbase: TypedPocketBase,
  collection: C,
) =>
  mutationOptions<CollectionResponses[C], ClientResponseError, Create<C>>({
    mutationKey: [collection, 'create'],
    mutationFn: async (data) => {
      return await pocketbase.collection(collection).create(data);
    },
    onError: (error) => {
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
  id?: string,
) =>
  mutationOptions<CollectionResponses[C], ClientResponseError, Update<C>>({
    mutationKey: [collection, 'update', id],
    mutationFn: async (data) => {
      if (!id) throw new Error('ID is required for updating a record');
      return await pocketbase.collection(collection).update(id, data);
    },
    onError: (error) => {
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
) =>
  mutationOptions<boolean, ClientResponseError, { id: string }>({
    mutationKey: [collection, 'delete'],
    mutationFn: async ({ id }) => {
      return await pocketbase.collection(collection).delete(id);
    },
    onError: (error) => {
      toast.error(`Error deleting record: ${error.message}`, {
        description: error.data?.message,
      });
    },
    onSuccess: () => {
      toast.success(`Record at ${collection} deleted successfully`);
    },
  });
