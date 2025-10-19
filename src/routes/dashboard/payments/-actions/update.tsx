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
  listPaymentsQuery,
  updatePaymentMutation,
  viewPaymentQuery,
} from '@/pocketbase/queries/payments';
import { updatePaymentSchema } from '@/pocketbase/schemas/payments';
import { EditPaymentForm } from './form';

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

  const form = useAppForm({
    defaultValues: {
      amountPaid: payment?.amountPaid ?? 0,
      bill: payment?.bill ?? '',
      paymentMethod: payment?.paymentMethod ?? '',
      paymentDate: payment?.paymentDate
        ? new Date(payment.paymentDate)
        : undefined,
      transactionId: payment?.transactionId ?? '',
    } as z.infer<typeof updatePaymentSchema>,
    validators: { onChange: updatePaymentSchema },
    onSubmit: async ({ value }) =>
      mutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listPaymentsQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({
            to: '/dashboard/payments',
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
          to: '/dashboard/payments',
          search: { edit: undefined, id: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit payment</DialogTitle>
          <DialogDescription>Update payment information</DialogDescription>
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
            <EditPaymentForm form={form} />
            <form.SubmitButton>Update Payment</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditPaymentDialogForm;
