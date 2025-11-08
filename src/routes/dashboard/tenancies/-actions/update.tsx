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
import { useAppForm } from '@/components/ui/form';
import { listApartmentUnitsQuery } from '@/pocketbase/queries/apartmentUnits';
import {
  listTenanciesQuery,
  updateTenancyMutation,
  viewTenancyQuery,
} from '@/pocketbase/queries/tenancies';
import { listTenantsQuery } from '@/pocketbase/queries/tenants';
import { updateTenanciesSchema } from '@/pocketbase/schemas/tenancies';
import { EditTenancyForm } from './form';

const EditTenancyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenancies' });
  const searchQuery = useSearch({ from: '/dashboard/tenancies/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenancies/' });

  const mutation = useMutation(updateTenancyMutation(searchQuery.id ?? ''));

  const [{ data: tenants }, { data: apartmentUnits }, { data: tenancy }] =
    useQueries(
      {
        queries: [
          {
            ...listTenantsQuery(1, 500),
            enabled: !!searchQuery.id && searchQuery.edit,
          },
          {
            ...listApartmentUnitsQuery(1, 500),
            enabled: !!searchQuery.id && searchQuery.edit,
          },
          {
            ...viewTenancyQuery(searchQuery.id ?? ''),
            enabled: !!searchQuery.id && searchQuery.edit,
          },
        ],
      },
      queryClient,
    );

  const form = useAppForm({
    defaultValues: {
      tenant: tenancy?.tenant ?? '',
      unit: tenancy?.unit ?? '',
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
          // Invalidate apartment units to refresh availability status
          queryClient.invalidateQueries(listApartmentUnitsQuery(1, 500));
          navigate({
            to: '/dashboard/tenancies',
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
          to: '/dashboard/tenancies',
          search: { edit: undefined, id: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tenancy</DialogTitle>
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
            <EditTenancyForm
              form={form}
              tenants={tenants?.items ?? []}
              apartmentUnits={apartmentUnits?.items ?? []}
            />
            <form.SubmitButton className="col-span-full mt-2">
              Update Tenancy
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTenancyDialogForm;
