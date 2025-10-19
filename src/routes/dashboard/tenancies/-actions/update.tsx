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
  listTenanciesQuery,
  updateTenancyMutation,
  viewTenancyQuery,
} from '@/pocketbase/queries/tenancies';
import { updateTenanciesSchema } from '@/pocketbase/schemas/tenancies';
import { listTenantsQuery } from '@/pocketbase/queries/tenants';
import { listApartmentUnitsQuery } from '@/pocketbase/queries/apartmentUnits';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const EditTenancyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenancies' });
  const searchQuery = useSearch({ from: '/dashboard/tenancies/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenancies/' });

  const mutation = useMutation(updateTenancyMutation(searchQuery.id ?? ''));

  const [{ data: tenants }, { data: apartmentUnits }, { data: tenancy }] = useQueries(
    {
      queries: [
        {
          ...listTenantsQuery(1, 500),
          enabled: !!searchQuery.id && searchQuery.edit
        },
        {
          ...listApartmentUnitsQuery(1, 500),
          enabled: !!searchQuery.id && searchQuery.edit
        },
        {
          ...viewTenancyQuery(searchQuery.id ?? ''),
          enabled: !!searchQuery.id && searchQuery.edit,
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
        <AutoForm schema={new ZodProvider(updateTenanciesSchema)} withSubmit />
      </DialogContent>
    </Dialog>
  );
};

export default EditTenancyDialogForm;
