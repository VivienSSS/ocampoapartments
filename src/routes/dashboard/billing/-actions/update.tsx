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
  listBillsQuery,
  updateBillMutation,
  viewBillQuery,
} from '@/pocketbase/queries/bills';
import { updateBillSchema } from '@/pocketbase/schemas/bills';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const EditBillingDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/billing' });
  const searchQuery = useSearch({ from: '/dashboard/billing/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/billing/' });

  const billMutation = useMutation(updateBillMutation(searchQuery.id ?? ''));

  const { data: bill } = useQuery(
    {
      ...viewBillQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.edit,
    },
    queryClient,
  );

  return (
    <Dialog
      open={!!searchQuery.edit && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          to: '/dashboard/billing',
          search: { edit: undefined, id: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Bill</DialogTitle>
          <DialogDescription>Update billing information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(updateBillSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditBillingDialogForm;
