import { mutationOptions, queryOptions } from "@tanstack/react-query";
import type { ClientResponseError } from "pocketbase";
import { toast } from "sonner";
import type z from "zod";
import { pb } from "..";
import type {
  insertMaintenanceRequestSchema,
  updateMaintenanceRequestSchema,
} from "../schemas/maintenanceRequests";
import {
  Collections,
  type MaintenanceRequestsResponse as MaintenanceRequestsClientResponse,
  type MaintenanceWorkersRecord,
} from "../types";
import type { TenantsResponse } from "./tenants";
import type { ApartmentUnitsResponse } from "./apartmentUnits";

export type MaintenanceRequestsResponse = MaintenanceRequestsClientResponse<
  {
    tenant: TenantsResponse;
    unit: ApartmentUnitsResponse;
    worker: MaintenanceWorkersRecord;
  }
>;

export const listMaintenanceRequestsQuery = (page: number, perPage: number) =>
  queryOptions({
    queryKey: [Collections.MaintenanceRequests, page, perPage],
    queryFn: () =>
      pb.collection(Collections.MaintenanceRequests).getList<
        MaintenanceRequestsResponse
      >(page, perPage, {
        expand: "tenant.user,unit,worker",
        fields: "*,description:excerpt(25,true)",
      }),
  });

export const viewMaintenanceRequestQuery = (id: string) =>
  queryOptions({
    queryKey: [Collections.MaintenanceRequests, id],
    queryFn: () =>
      pb.collection(Collections.MaintenanceRequests).getOne<
        MaintenanceRequestsResponse
      >(id),
  });

export const createMaintenanceRequestMutation = mutationOptions<
  MaintenanceRequestsResponse,
  ClientResponseError,
  z.infer<typeof insertMaintenanceRequestSchema>
>({
  mutationFn: async (value) =>
    pb.collection(Collections.MaintenanceRequests).create(value),
  onSuccess: (value) =>
    toast.success(`Successfully create`, {
      description: `Maintenance request created: ${value.id}`,
    }),
  onError: (err) =>
    toast.error(`An Error occured when creating a maintenance request`, {
      description: err.message,
    }),
});

export const updateMaintenanceRequestMutation = (id: string) =>
  mutationOptions<
    MaintenanceRequestsResponse,
    ClientResponseError,
    z.infer<typeof updateMaintenanceRequestSchema>
  >({
    mutationFn: async (value) =>
      pb.collection(Collections.MaintenanceRequests).update<
        MaintenanceRequestsResponse
      >(id, value),
    onSuccess: (value) =>
      toast.success(`Changes saved`, {
        description: `Maintenance request ${value.id} has been updated`,
      }),
    onError: (err) =>
      toast.error(
        `An Error occured when updating the maintenance request ${id}`,
        {
          description: err.message,
        },
      ),
  });

export const deleteMaintenanceRequestMutation = (id: string) =>
  mutationOptions({
    mutationFn: async () =>
      pb.collection(Collections.MaintenanceRequests).delete(id),
    onSuccess: () =>
      toast.success(`Deleted sucessfully`, {
        description: `Maintenance request ${id} has been deleted succesfully`,
      }),
    onError: (err) =>
      toast.error(
        `An Error occured when deleting the maintenance request ${id}`,
        {
          description: err.message,
        },
      ),
  });
