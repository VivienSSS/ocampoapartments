import { queryOptions } from '@tanstack/react-query';
import type { Collections, TypedPocketBase } from './types';
import type { RecordListOptions, RecordOptions } from 'pocketbase';

export type ListQueryOptionParams<C extends Collections> = {
  collection: C;
  page: number;
  perPage: number;
  options: RecordListOptions;
};

export const ListQueryOption = <T extends Collections>(
  pocketbase: TypedPocketBase,
  params: ListQueryOptionParams<T>,
) =>
  queryOptions({
    queryKey: [params.collection, params.page, params.perPage, params.options],
    queryFn: async () => {
      return await pocketbase
        .collection(params.collection)
        .getList(params.page, params.perPage, params.options);
    },
  });

export const ViewQueryOption = <T extends Collections>(
  pocketbase: TypedPocketBase,
  collection: T,
  id?: string,
  options?: RecordOptions,
) =>
  queryOptions({
    queryKey: [collection, id, options],
    queryFn: async () => {
      return await pocketbase.collection(collection).getOne(id || '', options);
    },
    enabled: !!id,
  });
