import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientResponseError } from "pocketbase";
import { toast } from "sonner";
import type z from "zod";
import { pb } from "..";
import type {
  insertTenanciesSchema,
  updateTenanciesSchema,
} from "../schemas/tenancies";
import {
  type ApartmentUnitsRecord,
  Collections,
  type TenanciesResponse as TenanciesClientResponse,
} from "../types";
import type { TenantsResponse } from "./tenants";

export type TenanciesResponse = TenanciesClientResponse<
  { tenant: TenantsResponse; unit: ApartmentUnitsRecord }
>;

export const listTenanciesQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Tenancies, page, perPage],
    queryFn: () =>
      pb.collection(Collections.Tenancies).getList<TenanciesResponse>(
        page,
        perPage,
        {
          expand: "tenant.user,unit",
        },
      ),
  });

export const viewTenancyQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Tenancies, id],
    queryFn: () =>
      pb.collection(Collections.Tenancies).getOne<TenanciesResponse>(id),
  });

export const createTenancyMutation = mutationOptions<
  TenanciesResponse,
  ClientResponseError,
  z.infer<typeof insertTenanciesSchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.Tenancies).create(value),
  onSuccess: (value) =>
    toast.success(`Successfully create`, {
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
    mutationFn: async (value) =>
      pb.collection(Collections.Tenancies).update(id, value),
    onSuccess: (value) =>
      toast.success(`Changes saved`, {
        description: `Tenancy ${value.id} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when updating the tenancy ${id}`, {
        description: err.message,
      }),
  });

export const deleteTenancyMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Tenancies).delete(id),
    onSuccess: () =>
      toast.success(`Deleted sucessfully`, {
        description: `Tenancy ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when deleting the tenancy ${id}`, {
        description: err.message,
      }),
  });
