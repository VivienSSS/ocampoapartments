import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientResponseError } from "pocketbase";
import { toast } from "sonner";
import type z from "zod";
import { pb } from "..";
import type { insertBillSchema, updateBillSchema } from "../schemas/bills";
import {
  type BillsResponse as BillsClientResponse,
  Collections,
  type TenanciesRecord,
} from "../types";

export type BillsResponse = BillsClientResponse<{
  tenancy: TenanciesRecord;
}>;

export const listBillsQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Bills, page, perPage],
    queryFn: () =>
      pb.collection<BillsResponse>(Collections.Bills).getList(page, perPage, {
        expand: "tenancy",
      }),
  });

export const viewBillQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Bills, id],
    queryFn: () =>
      pb.collection<BillsResponse>(Collections.Bills).getOne(id, {
        expand: "tenancy",
      }),
  });

export const createBillMutation = mutationOptions<
  BillsResponse,
  ClientResponseError,
  z.infer<typeof insertBillSchema>
>({
  mutationFn: async (value) => {
    const { items, ...bill } = value;

    const billRecord = await pb.collection(Collections.Bills).create<
      BillsResponse
    >(bill, {
      expand: "tenancy",
    });

    for (const item of items) {
      const billItem = { bill: billRecord.id, ...item };

      await pb.collection(Collections.BillItems).create(billItem);
    }

    return billRecord;
  },
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
      pb.collection(Collections.Bills).update<BillsResponse>(id, value, {
        expand: "tenancy",
      }),
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
