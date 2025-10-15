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
  listPaymentsQuery,
  updatePaymentMutation,
  viewPaymentQuery,
} from '@/pocketbase/queries/payments';
import { AutoForm } from '@/components/ui/autoform';
import { updatePaymentSchema } from '@/pocketbase/schemas/payments';
import { ZodProvider } from '@autoform/zod';

const EditPaymentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/payments' });
  const searchQuery = useSearch({ from: '/dashboard/payments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/payments/' });

  const mutation = useMutation(updatePaymentMutation(searchQuery.id ?? ''));

  const { data: payment } = useQuery(
    {
      ...viewPaymentQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.edit,
    },
    queryClient,
  );

  return (
    <Dialog
      open={!!searchQuery.edit && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          to: '/dashboard/payments',
          search: { edit: undefined, id: undefined },
        })
      }
    >
      <DialogContent className="!max-h-3/4 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit payment</DialogTitle>
          <DialogDescription>Update payment information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(updatePaymentSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentDialogForm;
