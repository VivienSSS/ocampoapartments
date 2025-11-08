import { useMutation } from '@tanstack/react-query';
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
  createPaymentMutation,
  listPaymentsQuery,
} from '@/pocketbase/queries/payments';
import type { insertPaymentSchema } from '@/pocketbase/schemas/payments';
import { CreatePaymentForm } from './form';

const CreatePaymentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/payments' });
  const search = useSearch({ from: '/dashboard/payments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/payments/' });

  const mutation = useMutation(createPaymentMutation);

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertPaymentSchema>,
    onSubmit: async ({ value }) => {
      mutation.mutate(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listPaymentsQuery(search.page, search.perPage),
          );
          navigate({ to: '/dashboard/payments', search: { new: undefined } });
        },
      });
    },
  });

  return (
    <Dialog
      open={!!search.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/payments', search: { new: undefined } })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to create a new payment?</DialogTitle>
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
            <CreatePaymentForm form={form} />
            <form.SubmitButton className="col-span-full">
              Create Payment
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePaymentDialogForm;
