import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppForm } from '@/components/ui/forms';
import {
  createApartmentUnitMutation,
  listApartmentUnitsQuery,
} from '@/pocketbase/queries/apartmentUnits';
import { listPropertiesQuery } from '@/pocketbase/queries/properties';
import type { insertApartmentUnitSchema } from '@/pocketbase/schemas/apartmentUnits';
import { CreateApartmentForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const CreateApartmentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/apartments' });
  const searchQuery = useSearch({ from: '/dashboard/apartments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/apartments/' });

  const apartmentMutation = useMutation(createApartmentUnitMutation);

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertApartmentUnitSchema>,
    onSubmit: async ({ value }) =>
      apartmentMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listApartmentUnitsQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({ to: '/dashboard/apartments', search: { new: undefined } });
        },
      }),
  });
  return (
    <form.AppForm>
      <FormDialog
        title={'Want to add a new unit?'}
        description={'Enter the right information'}
        open={searchQuery.new}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/apartments',
            search: { new: undefined },
          })
        }
      >
        <CreateApartmentForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreateApartmentDialogForm;
