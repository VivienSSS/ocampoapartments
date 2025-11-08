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
import { useAppForm } from '@/components/ui/forms';
import { listApartmentUnitsQuery } from '@/pocketbase/queries/apartmentUnits';
import {
  listTenanciesQuery,
  updateTenancyMutation,
  viewTenancyQuery,
} from '@/pocketbase/queries/tenancies';
import { listTenantsQuery } from '@/pocketbase/queries/tenants';
import { updateTenanciesSchema } from '@/pocketbase/schemas/tenancies';
import { EditTenancyForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

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
    <form.AppForm>
      <FormDialog
        open={!!searchQuery.edit && !!searchQuery.id}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/tenancies',
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
        title="Edit Tenancy"
        description="Update tenancy information"
      >
        <EditTenancyForm
          form={form}
          tenants={tenants?.items ?? []}
          apartmentUnits={apartmentUnits?.items ?? []}
        />
      </FormDialog>
    </form.AppForm>
  );
};

export default EditTenancyDialogForm;
