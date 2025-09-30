import { mutationOptions, queryOptions } from '@tanstack/react-query';
import type { ClientResponseError, RecordAuthResponse } from 'pocketbase';
import { toast } from 'sonner';
import type z from 'zod';
import { pb } from '..';
import type { loginUserSchema, registerUserSchema } from '../schemas/users';
import { Collections, type UsersResponse } from '../types';

export const listUserQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Users, page, perPage],
    queryFn: () => pb.collection(Collections.Users).getList(page, perPage),
  });

export const viewUserQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Users, id],
    queryFn: () => pb.collection(Collections.Users).getOne(id),
  });

export const registerUserMutation = mutationOptions<
  void,
  Error,
  z.infer<typeof registerUserSchema>
>({
  mutationFn: async (v) => {
    if (v.acceptTOC) {
      throw new Error('Please accept terms and conditions');
    }

    if (v.confirmPassword !== v.password) {
      throw new Error('Password does not match');
    }

    await pb.collection(Collections.Users).create(v);
  },
  onSuccess: () =>
    toast.success('Registration successfull', {
      description: 'redirecting...',
    }),
  onError: (err) => toast.error(err.name, { description: err.message }),
});

export const loginUserMutation = mutationOptions<
  RecordAuthResponse<UsersResponse>,
  ClientResponseError,
  z.infer<typeof loginUserSchema>
>({
  mutationFn: async (v) =>
    pb.collection(Collections.Users).authWithPassword(v.email, v.password),
  onError: (err) => toast.error(err.name, { description: err.message }),
});
