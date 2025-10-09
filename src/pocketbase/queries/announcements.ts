import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type {
  insertAnnouncementSchema,
  updateAnnouncementSchema,
} from '../schemas/announcements';
import {
  type AnnouncementsResponse as AnnouncementsClientResponse,
  Collections,
  type UsersRecord,
} from '../types';

export type AnnouncementsResponse = AnnouncementsClientResponse<{
  author: UsersRecord;
}>;

export const listAnnouncementsQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Announcements, page, perPage],
    queryFn: () =>
      pb
        .collection<AnnouncementsResponse>(Collections.Announcements)
        .getList(page, perPage, { expand: 'author', requestKey: null }),
  });

export const inAnnouncementsQuery = (selected: string[]) => queryOptions({
  queryKey: [Collections.Announcements, selected],
  queryFn: () =>
    pb
      .collection<AnnouncementsResponse>(Collections.Announcements)
      .getFullList({ filter: selected.map((id) => `id='${id}'`).join("||"), requestKey: null }),
});

export const viewAnnouncementQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Announcements, id],
    queryFn: () =>
      pb
        .collection<AnnouncementsResponse>(Collections.Announcements)
        .getOne(id, {
          expand: 'author',
          requestKey: null
        }),
  });

export const createAnnouncementMutation = mutationOptions<
  AnnouncementsResponse,
  ClientResponseError,
  z.infer<typeof insertAnnouncementSchema>
>({
  mutationFn: async (value) =>
    pb
      .collection(Collections.Announcements)
      .create<AnnouncementsResponse>(value, { expand: 'author', requestKey: null }),
  onSuccess: (value) =>
    toast.success(`Successfully create`, {
      description: `Announcement created: ${value.title}`,
    }),
  onError: (err) =>
    toast.error(`An Error occured when creating an announcement`, {
      description: err.message,
    }),
});

export const updateAnnouncementMutation = (id: string) =>
  mutationOptions<
    AnnouncementsResponse,
    ClientResponseError,
    z.infer<typeof updateAnnouncementSchema>
  >({
    mutationFn: async (value) =>
      pb
        .collection(Collections.Announcements)
        .update<AnnouncementsResponse>(id, value, { expand: 'author' }),
    onSuccess: (value) =>
      toast.success(`Changes saved`, {
        description: `Announcement ${value.title} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when updating the announcement ${id}`, {
        description: err.message,
      }),
  });

export const deleteAnnouncementMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Announcements).delete(id),
    onSuccess: () =>
      toast.success(`Deleted sucessfully`, {
        description: `Announcement ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when deleting the announcement ${id}`, {
        description: err.message,
      }),
  });

export const batchDeleteAnnouncementMutation = (selected: string[]) =>
  mutationOptions({
    mutationFn: async () => {
      const batch = pb.createBatch();

      for (const id of selected) {
        batch.collection(Collections.Announcements).delete(id);
      }

      return await batch.send({ requestKey: null });
    },
    onSuccess: () =>
      toast.success(`Deleted successfully`, {
        description: `Announcements ${selected.join(', ')} have been deleted successfully`,
      }),
    onError: (err) =>
      toast.error(`An error occurred when deleting the announcements`, {
        description: `Announcements: ${selected.join(', ')}\n${err.message}`,
      }),
  });