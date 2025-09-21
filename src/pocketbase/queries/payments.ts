import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientResponseError } from "pocketbase";
import { toast } from "sonner";
import type z from "zod";
import { pb } from "..";
import type {
  insertPaymentSchema,
  updatePaymentSchema,
} from "../schemas/payments";
import {
  type BillsRecord,
  Collections,
  type PaymentsResponse as PaymentsClientResponse,
  type TenantsRecord,
} from "../types";

export type PaymentsResponse = PaymentsClientResponse<{
  bill: BillsRecord;
  tenant: TenantsRecord;
}>;

export const listPaymentsQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.Payments, page, perPage],
    queryFn: () =>
      pb.collection<PaymentsResponse>(Collections.Payments).getList(
        page,
        perPage,
        {
          expand: "bill,tenant",
        },
      ),
  });

export const viewPaymentQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.Payments, id],
    queryFn: () =>
      pb.collection<PaymentsResponse>(Collections.Payments).getOne(id, {
        expand: "bill,tenant",
      }),
  });

export const createPaymentMutation = mutationOptions<
  PaymentsResponse,
  ClientResponseError,
  z.infer<typeof insertPaymentSchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.Payments).create<PaymentsResponse>(value, {
      expand: "bill,tenant",
    }),
  onSuccess: (value) =>
    toast.success(`Successfully create`, {
      description: `Payment recorded: ${value.transactionId}`,
    }),
  onError: (err) =>
    toast.error(`An Error occured when creating a payment`, {
      description: err.message,
    }),
});

export const updatePaymentMutation = (id: string) =>
  mutationOptions<
    PaymentsResponse,
    ClientResponseError,
    z.infer<typeof updatePaymentSchema>
  >({
    mutationFn: async (value) =>
      pb.collection(Collections.Payments).update<PaymentsResponse>(id, value, {
        expand: "bill,tenant",
      }),
    onSuccess: (value) =>
      toast.success(`Changes saved`, {
        description: `Payment ${value.transactionId} has been updated`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when updating the payment ${id}`, {
        description: err.message,
      }),
  });

export const deletePaymentMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () => pb.collection(Collections.Payments).delete(id),
    onSuccess: () =>
      toast.success(`Deleted sucessfully`, {
        description: `Payment ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(`An Error occured when deleting the payment ${id}`, {
        description: err.message,
      }),
  });
