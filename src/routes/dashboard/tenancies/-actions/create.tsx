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
import { listApartmentUnitsQuery } from '@/pocketbase/queries/apartmentUnits';
import {
  createTenancyMutation,
  listTenanciesQuery,
} from '@/pocketbase/queries/tenancies';
import { listTenantsQuery } from '@/pocketbase/queries/tenants';
import { insertTenanciesSchema } from '@/pocketbase/schemas/tenancies';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const CreateTenancyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenancies' });
  const search = useSearch({ from: '/dashboard/tenancies/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenancies/' });

  const mutation = useMutation(createTenancyMutation);

  const [{ data: tenants }, { data: apartmentUnits }] = useQueries({
    queries: [
      {
        ...listTenantsQuery(1, 500),
        enabled: search.new
      },
      {
        ...listApartmentUnitsQuery(1, 500),
        enabled: search.new
      },
    ],
  });

  return (
    <Dialog
      open={!!search.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/tenancies', search: { new: undefined } })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to add a new tenancy?</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(insertTenanciesSchema)} withSubmit />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTenancyDialogForm;
