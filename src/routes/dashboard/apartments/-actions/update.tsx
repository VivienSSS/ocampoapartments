import { useMutation, useQueries, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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
import { useAppForm } from '@/components/ui/form';
import {
  listApartmentUnitsQuery,
  updateApartmentUnitMutation,
  viewApartmentUnitQuery,
} from '@/pocketbase/queries/apartmentUnits';
import { listPropertiesQuery } from '@/pocketbase/queries/properties';
import { updateApartmentUnitSchema } from '@/pocketbase/schemas/apartmentUnits';
import { EditApartmentForm } from './form';

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

  const form = useAppForm({
    defaultValues: {
      unitLetter: '',
      property: undefined,
      floorNumber: undefined,
      capacity: undefined,
      price: undefined,
      isAvailable: true,
    } as z.infer<typeof updateApartmentUnitSchema>,
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

  // Update form values when data loads
  useEffect(() => {
    if (apt) {
      form.setFieldValue('unitLetter', apt.unitLetter ?? '');
      form.setFieldValue('property', apt.property ?? undefined);
      form.setFieldValue('floorNumber', apt.floorNumber ?? undefined);
      form.setFieldValue('capacity', apt.capacity ?? undefined);
      form.setFieldValue('price', apt.price ?? undefined);
      form.setFieldValue('isAvailable', apt.isAvailable ?? true);
    }
  }, [apt, form]);

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <EditApartmentForm
              form={form}
              properties={properties?.items ?? []}
            />
            <div className="mt-6">
              <form.SubmitButton>Update Unit</form.SubmitButton>
            </div>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditApartmentDialogForm;
