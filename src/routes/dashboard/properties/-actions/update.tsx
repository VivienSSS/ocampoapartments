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
  updatePropertyMutation,
  viewPropertiesQuery,
} from '@/pocketbase/queries/properties';
import { insertPropertySchema, updatePropertySchema } from '@/pocketbase/schemas/properties';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const EditPropertyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/properties' });
  const searchQuery = useSearch({ from: '/dashboard/properties/' });
  const propertyMutation = useMutation(
    updatePropertyMutation(searchQuery.id ?? ''),
  );
  const { queryClient } = useRouteContext({ from: '/dashboard/properties/' });

  const { data: property } = useQuery(
    {
      ...viewPropertiesQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.delete,
    },
    queryClient,
  );

  return (
    <Dialog
      open={searchQuery.edit && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          to: '/dashboard/properties',
          search: { edit: undefined, id: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Existing Property</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(insertPropertySchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditPropertyDialogForm;
