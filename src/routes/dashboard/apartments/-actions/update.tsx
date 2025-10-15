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
import {
  updateApartmentUnitMutation,
  viewApartmentUnitQuery,
} from '@/pocketbase/queries/apartmentUnits';
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

  const { data: apt, isLoading } = useQuery(
    {
      ...viewApartmentUnitQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.edit,
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
        {!isLoading && <AutoForm
          onSubmit={(value: z.infer<typeof updateApartmentUnitSchema>) => mutation.mutate(value, {
            onSuccess: () => {
              navigate({ to: '/dashboard/apartments', search: { new: undefined } })
            }
          })}
          defaultValues={apt}
          schema={new ZodProvider(updateApartmentUnitSchema)} withSubmit />}
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialogForm;
