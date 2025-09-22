import { useAppForm } from "@/components/ui/form";
import { EditTenancyForm } from "./form";
import {
  listTenanciesQuery,
  updateTenancyMutation,
  viewTenancyQuery,
} from "@/pocketbase/queries/tenancies";
import { updateTenanciesSchema } from "@/pocketbase/schemas/tenancies";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type z from "zod";

const EditTenancyDialogForm = () => {
  const navigate = useNavigate({ from: "/dashboard/tenancies" });
  const searchQuery = useSearch({ from: "/dashboard/tenancies/" });
  const { queryClient } = useRouteContext({ from: "/dashboard/tenancies/" });

  const mutation = useMutation(
    updateTenancyMutation(searchQuery.id ?? ""),
  );

  const { data: tenancy } = useQuery(
    {
      ...viewTenancyQuery(searchQuery.id ?? ""),
      enabled: !!searchQuery.id && searchQuery.edit,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {
      tenant: tenancy?.tenant ?? "",
      unit: tenancy?.unit ?? "",
      leaseStartDate: tenancy?.leaseStartDate
        ? new Date(tenancy.leaseStartDate)
        : undefined,
      leaseEndDate: tenancy?.leaseEndDate
        ? new Date(tenancy.leaseEndDate)
        : undefined,
    } as z.infer<typeof updateTenanciesSchema>,
    validators: { onChange: updateTenanciesSchema },
    onSubmit: async ({ value }) =>
      mutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listTenanciesQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({
            to: "/dashboard/tenancies",
            search: { edit: undefined, id: undefined },
          });
        },
      }),
  });

  return (
    <Dialog
      open={!!searchQuery.edit && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          to: "/dashboard/tenancies",
          search: { edit: undefined, id: undefined },
        })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit tenancy</DialogTitle>
          <DialogDescription>Update tenancy information</DialogDescription>
        </DialogHeader>
        <form
          className="grid grid-cols-4 gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <EditTenancyForm form={form} />
            <form.SubmitButton>Update Tenancy</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTenancyDialogForm;
