import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientResponseError } from "pocketbase";
import { toast } from "sonner";
import type z from "zod";
import { pb } from "..";
import type { insertBillSchema, updateBillSchema } from "../schemas/bills";
import { type BillsResponse, Collections } from "../types";

export const listBillsQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Bills, page, perPage],
    queryFn: () => pb.collection(Collections.Bills).getList(page, perPage),
  });

export const viewBillQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Bills, id],
    queryFn: () => pb.collection(Collections.Bills).getOne(id),
  });

export const createBillMutation = mutationOptions<
  BillsResponse,
  ClientResponseError,
  z.infer<typeof insertBillSchema>
>({
  mutationFn: async (value) => pb.collection(Collections.Bills).create(value),
  onSuccess: (value) =>
    toast.success(`Successfully create`, {
      description: `Bill created for tenancy: ${value.tenancy}`,
    }),
  onError: (err) =>
    toast.error(`An Error occured when creating a bill`, {
      description: err.message,
    }),
});

export const updateBillMutation = (id: string) =>
  mutationOptions<
    BillsResponse,
    ClientResponseError,
    z.infer<typeof updateBillSchema>
  >({
    mutationFn: async (value) =>
      pb.collection(Collections.Bills).update(id, value),
    onSuccess: (value) =>
      toast.success(`Changes saved`, {
        description: `Bill ${value.id} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when updating the bill ${id}`, {
        description: err.message,
      }),
  });

export const deleteBillMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Bills).delete(id),
    onSuccess: () =>
      toast.success(`Deleted sucessfully`, {
        description: `Bill ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when deleting the bill ${id}`, {
        description: err.message,
      }),
  });
