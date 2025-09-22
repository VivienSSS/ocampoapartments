import { useMutation, useQuery } from "@tanstack/react-query";
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import type z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppForm } from "@/components/ui/form";
import type { insertApartmentUnitSchema } from "@/pocketbase/schemas/apartmentUnits";
import { CreateApartmentForm } from "./form";
import {
  createApartmentUnitMutation,
  listApartmentUnitsQuery,
} from "@/pocketbase/queries/apartmentUnits";
import { listPropertiesQuery } from "@/pocketbase/queries/properties";

const CreateApartmentDialogForm = () => {
  const navigate = useNavigate({ from: "/dashboard/apartments" });
  const searchQuery = useSearch({ from: "/dashboard/apartments/" });
  const { queryClient } = useRouteContext({ from: "/dashboard/apartments/" });

  const apartmentMutation = useMutation(createApartmentUnitMutation);

  const { data: properties } = useQuery(
    {
      ...listPropertiesQuery(1, 500),
      enabled: searchQuery.new,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertApartmentUnitSchema>,
    onSubmit: async ({ value }) =>
      apartmentMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listApartmentUnitsQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({ to: "/dashboard/apartments", search: { new: undefined } });
        },
      }),
  });
  return (
    <Dialog
      open={searchQuery.new}
      onOpenChange={() =>
        navigate({ to: "/dashboard/apartments", search: { new: undefined } })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new property</DialogTitle>
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
            <CreateApartmentForm
              form={form}
              properties={properties?.items ?? []}
            />
            <form.SubmitButton className="col-span-full">
              Create apartment
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateApartmentDialogForm;
