import { useAppForm } from "@/components/ui/form";
import {
  listPropertiesQuery,
  updatePropertyMutation,
  viewPropertiesQuery,
} from "@/pocketbase/queries/properties";
import { updatePropertySchema } from "@/pocketbase/schemas/properties";
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
import { EditPropertyForm } from "./form";

const EditPropertyDialogForm = () => {
  const navigate = useNavigate({ from: "/dashboard/properties" });
  const searchQuery = useSearch({ from: "/dashboard/properties/" });
  const propertyMutation = useMutation(
    updatePropertyMutation(searchQuery.id!),
  );
  const { queryClient } = useRouteContext({ from: "/dashboard/properties/" });

  const { data: property } = useQuery(
    {
      ...viewPropertiesQuery(searchQuery.id!),
      enabled: !!searchQuery.id && searchQuery.delete,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {
      address: property?.address ?? "",
      branch: property?.branch ?? "",
    } as z.infer<typeof updatePropertySchema>,
    validators: {
      onChange: updatePropertySchema,
    },
    onSubmit: async ({ value }) =>
      propertyMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listPropertiesQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({ to: "/dashboard/properties", search: { new: undefined } });
        },
      }),
  });

  return (
    <Dialog
      open={searchQuery.edit && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          to: "/dashboard/properties",
          search: { edit: undefined, id: undefined },
        })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit existing property</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
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
            <EditPropertyForm form={form} />
            <form.SubmitButton>Update property</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyDialogForm;
