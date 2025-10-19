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
import {
  listTenantsQuery,
  updateTenantMutation,
  viewTenantQuery,
} from '@/pocketbase/queries/tenants';
import { listUserQuery } from '@/pocketbase/queries/users';
import type { updateTenantSchema } from '@/pocketbase/schemas/tenants';
import { EditApartmentForm } from './form';

const EditTenantDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenants' });
  const searchQuery = useSearch({ from: '/dashboard/tenants/' });
  const tenantMutation = useMutation(
    updateTenantMutation(searchQuery.id ?? ''),
  );
  const { queryClient } = useRouteContext({ from: '/dashboard/tenants/' });

  const [{ data: users }, { data: tenant }] = useQueries(
    {
      queries: [
        {
          ...listUserQuery(1, 500),
          enabled: searchQuery.edit && !!searchQuery.id,
        },
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
    <Dialog
      open={!!searchQuery.edit && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          search: { edit: undefined, id: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Existing Tenant</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
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
            <EditApartmentForm form={form} users={users?.items || []} />
            <form.SubmitButton className='col-span-full mt-2'>Update Tenant</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTenantDialogForm;
