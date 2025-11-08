import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/forms';
import {
  listApartmentUnitsQuery,
  updateApartmentUnitMutation,
  viewApartmentUnitQuery,
} from '@/pocketbase/queries/apartmentUnits';
import { updateApartmentUnitSchema } from '@/pocketbase/schemas/apartmentUnits';
import { EditApartmentForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const EditApartmentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/apartments' });
  const searchQuery = useSearch({ from: '/dashboard/apartments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/apartments/' });

  const mutation = useMutation(
    updateApartmentUnitMutation(searchQuery.id ?? ''),
  );

  const { data: apartment } = useQuery(
    {
      ...viewApartmentUnitQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.edit,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {
      ...apartment,
    } as z.infer<typeof updateApartmentUnitSchema>,
    validators: {
      onSubmit: updateApartmentUnitSchema,
    },
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
    <form.AppForm>
      <FormDialog
        title={'Edit Apartment Unit'}
        description={'Update the necessary information'}
        open={!!searchQuery.edit && !!searchQuery.id}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/apartments',
            search: { edit: undefined, id: undefined },
          })
        }
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        onClear={(e) => {
          e.preventDefault();
          form.reset();
        }}
      >
        <EditApartmentForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default EditApartmentDialogForm;
