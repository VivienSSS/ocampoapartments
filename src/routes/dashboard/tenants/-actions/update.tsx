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
import {
  listTenantsQuery,
  updateTenantMutation,
  viewTenantQuery,
} from '@/pocketbase/queries/tenants';
import { listUserQuery } from '@/pocketbase/queries/users';
import { updateTenantSchema } from '@/pocketbase/schemas/tenants';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

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
        <AutoForm schema={new ZodProvider(updateTenantSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditTenantDialogForm;
