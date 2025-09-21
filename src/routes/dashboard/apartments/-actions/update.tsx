import { useAppForm } from '@/components/ui/form';
import { EditApartmentForm } from './form';
import {
  listApartmentUnitsQuery,
  updateApartmentUnitMutation,
  viewApartmentUnitQuery,
} from '@/pocketbase/queries/apartmentUnits';
import { updateApartmentUnitSchema } from '@/pocketbase/schemas/apartmentUnits';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type z from 'zod';

const EditApartmentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/apartments' });
  const searchQuery = useSearch({ from: '/dashboard/apartments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/apartments/' });

  const mutation = useMutation(
    updateApartmentUnitMutation(searchQuery.id ?? ''),
  );

  const { data: apt } = useQuery(
    {
      ...viewApartmentUnitQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.edit,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {
      unitLetter: apt?.unitLetter ?? '',
      property: apt?.property ?? undefined,
    } as z.infer<typeof updateApartmentUnitSchema>,
    validators: { onChange: updateApartmentUnitSchema },
    onSubmit: async ({ value }) =>
      mutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listApartmentUnitsQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({
            to: '/dashboard/apartments',
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
          to: '/dashboard/apartments',
          search: { edit: undefined, id: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit apartment unit</DialogTitle>
          <DialogDescription>Update information</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <EditApartmentForm form={form} />
            <form.SubmitButton>Update Apartment</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialogForm;
