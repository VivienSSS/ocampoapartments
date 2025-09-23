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
import { useAppForm } from '@/components/ui/form';
import {
  createTenantMutation,
  listTenantsQuery,
} from '@/pocketbase/queries/tenants';
import { listUserQuery } from '@/pocketbase/queries/users';
import { insertTenantSchema } from '@/pocketbase/schemas/tenants';
import { CreateTenantForm } from './form';

const CreateTenantDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenants' });
  const searchParams = useSearch({ from: '/dashboard/tenants/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenants/' });

  const tenantMutation = useMutation(createTenantMutation);
  const { data: users } = useQuery(
    {
      ...listUserQuery(1, 500),
      enabled: searchParams.new,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertTenantSchema>,
    validators: {
      onChange: insertTenantSchema,
    },
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
    <Dialog
      open={searchParams.new}
      onOpenChange={() => navigate({ search: { new: undefined } })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new tenant</DialogTitle>
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
            <CreateTenantForm form={form} users={users?.items ?? []} />
            <form.SubmitButton className="col-span-full">
              Create Tenant
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTenantDialogForm;
