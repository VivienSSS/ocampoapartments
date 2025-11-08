import { useMutation, useQueries } from '@tanstack/react-query';
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
  createTenancyMutation,
  listTenanciesQuery,
} from '@/pocketbase/queries/tenancies';
import { listTenantsQuery } from '@/pocketbase/queries/tenants';
import type { insertTenanciesSchema } from '@/pocketbase/schemas/tenancies';
import { CreateTenancyForm, LeaseContract } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const CreateTenancyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenancies' });
  const search = useSearch({ from: '/dashboard/tenancies/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenancies/' });

  const mutation = useMutation(createTenancyMutation);

  const form = useAppForm({
    defaultValues: {} as Omit<
      z.infer<typeof insertTenanciesSchema>,
      'leaseStartDate' | 'leaseEndDate'
    > & { leaseContract: LeaseContract },
    onSubmit: async ({ value }) => {
      const now = new Date();
      let leaseEndDate: Date;

      if (value.leaseContract === LeaseContract.FullYear) {
        leaseEndDate = new Date(now);
        leaseEndDate.setFullYear(now.getFullYear() + 1);
      } else {
        leaseEndDate = new Date(now);
        leaseEndDate.setMonth(now.getMonth() + 6);
      }

      mutation.mutate(
        {
          unit: value.unit,
          tenant: value.tenant,
          leaseStartDate: now,
          leaseEndDate,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(
              listTenanciesQuery(search.page, search.perPage),
            );
            // Invalidate apartment units to refresh availability status
            queryClient.invalidateQueries(listApartmentUnitsQuery(1, 500));
            navigate({
              to: '/dashboard/tenancies',
              search: { new: undefined },
            });
          },
        },
      );
    },
  });

  return (
    <form.AppForm>
      <FormDialog
        title="Create New Tenancy"
        description="Enter the right information"
        open={!!search.new}
        onOpenChange={() =>
          navigate({ to: '/dashboard/tenancies', search: { new: undefined } })
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
        <CreateTenancyForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreateTenancyDialogForm;
