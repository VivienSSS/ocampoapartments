import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
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
import {
  updateApartmentUnitMutation,
  viewApartmentUnitQuery,
} from '@/pocketbase/queries/apartmentUnits';
import { listPropertiesQuery } from '@/pocketbase/queries/properties';
import { updateApartmentUnitSchema } from '@/pocketbase/schemas/apartmentUnits';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const EditApartmentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/apartments' });
  const searchQuery = useSearch({ from: '/dashboard/apartments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/apartments/' });

  const mutation = useMutation(
    updateApartmentUnitMutation(searchQuery.id ?? ''),
  );

  const [{ data: apt }, { data: properties }] = useQueries(
    {
      queries: [
        {
          ...viewApartmentUnitQuery(searchQuery.id ?? ''),
          enabled: !!searchQuery.id && searchQuery.edit,
        },
        {
          ...listPropertiesQuery(1, 500),
          enabled: !!searchQuery.id && searchQuery.edit,
        },
      ],
    },
    queryClient,
  );

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
          <DialogTitle>Edit Apartment Unit</DialogTitle>
          <DialogDescription>Update information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(updateApartmentUnitSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialogForm;
