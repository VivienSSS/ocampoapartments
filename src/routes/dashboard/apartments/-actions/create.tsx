import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import { ZodProvider } from "@autoform/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  createApartmentUnitMutation,
  listApartmentUnitsQuery,
} from '@/pocketbase/queries/apartmentUnits';
import { listPropertiesQuery } from '@/pocketbase/queries/properties';
import { insertApartmentUnitSchema } from '@/pocketbase/schemas/apartmentUnits';
import { AutoForm } from '@/components/ui/autoform';

const CreateApartmentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/apartments' });
  const searchQuery = useSearch({ from: '/dashboard/apartments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/apartments/' });

  const apartmentMutation = useMutation(createApartmentUnitMutation);

  const { data: properties } = useQuery(
    {
      ...listPropertiesQuery(1, 500),
      enabled: searchQuery.new,
    },
    queryClient,
  );

  return (
    <Dialog
      open={searchQuery.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/apartments', search: { new: undefined } })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to add a new unit?</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(insertApartmentUnitSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateApartmentDialogForm;
