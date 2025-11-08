import { useMutation } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/forms';
import {
  createTenantMutation,
  listTenantsQuery,
} from '@/pocketbase/queries/tenants';
import type { insertTenantSchema } from '@/pocketbase/schemas/tenants';
import { CreateTenantForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const CreateTenantDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenants' });
  const searchParams = useSearch({ from: '/dashboard/tenants/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenants/' });

  const tenantMutation = useMutation(createTenantMutation);

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertTenantSchema>,
    onSubmit: async ({ value }) =>
      tenantMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listTenantsQuery(searchParams.page, searchParams.perPage),
          );
          navigate({ search: { new: undefined } });
        },
      }),
  });

  return (
    <form.AppForm>
      <FormDialog
        title="Create New Tenant"
        description="Fill in the details to add a new tenant"
        open={searchParams.new}
        onOpenChange={() => navigate({ search: { new: undefined } })}
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
        <CreateTenantForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreateTenantDialogForm;
