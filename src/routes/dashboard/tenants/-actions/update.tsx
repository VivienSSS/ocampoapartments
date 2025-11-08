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
import {
  listTenantsQuery,
  updateTenantMutation,
  viewTenantQuery,
} from '@/pocketbase/queries/tenants';
import type { updateTenantSchema } from '@/pocketbase/schemas/tenants';
import { EditTenantForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const EditTenantDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenants' });
  const searchQuery = useSearch({ from: '/dashboard/tenants/' });
  const tenantMutation = useMutation(
    updateTenantMutation(searchQuery.id ?? ''),
  );
  const { queryClient } = useRouteContext({ from: '/dashboard/tenants/' });

  const [{ data: tenant }] = useQueries(
    {
      queries: [
        {
          ...viewTenantQuery(searchQuery.id ?? ''),
          enabled: searchQuery.edit && !!searchQuery.id,
        },
      ],
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {
      phoneNumber: tenant?.phoneNumber ?? '',
      facebookName: tenant?.facebookName ?? '',
      user: tenant?.user ?? undefined,
    } as z.infer<typeof updateTenantSchema>,
    // validators: {
    //   onChange: updateTenantSchema,
    // },
    onSubmit: async ({ value }) =>
      tenantMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listTenantsQuery(searchQuery.page, searchQuery.perPage),
          );
          queryClient.invalidateQueries(viewTenantQuery(searchQuery.id ?? ''));
          navigate({
            search: { edit: undefined, id: undefined },
          });
        },
      }),
  });

  return (
    <form.AppForm>
      <FormDialog
        title="Edit Existing Tenant"
        description="Enter the right information"
        open={!!searchQuery.edit && !!searchQuery.id}
        onOpenChange={() =>
          navigate({
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
        <EditTenantForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default EditTenantDialogForm;
