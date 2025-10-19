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
  createTenantMutation,
  listTenantsQuery,
} from '@/pocketbase/queries/tenants';
import { listUserQuery } from '@/pocketbase/queries/users';
import { insertTenantSchema } from '@/pocketbase/schemas/tenants';
import { CreateTenantForm } from './form';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

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

  return (
    <Dialog
      open={searchParams.new}
      onOpenChange={() => navigate({ search: { new: undefined } })}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to add a new tenant?</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(insertTenantSchema)} onSubmit={(value) => {
          tenantMutation.mutate(value, {
            onSuccess: () => {
              navigate({ search: { new: undefined } })
            }
          })
        }} withSubmit />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTenantDialogForm;
