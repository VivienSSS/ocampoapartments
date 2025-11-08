import { useMutation } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';

import { useAppForm } from '@/components/ui/forms';
import {
  createPaymentMutation,
  listPaymentsQuery,
} from '@/pocketbase/queries/payments';
import { insertPaymentSchema } from '@/pocketbase/schemas/payments';
import { CreatePaymentForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';
import { PaymentsPaymentMethodOptions } from '@/pocketbase/types';

const CreatePaymentDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/payments' });
  const search = useSearch({ from: '/dashboard/payments/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/payments/' });

  const mutation = useMutation(createPaymentMutation);

  const form = useAppForm({
    defaultValues: {
      paymentMethod: PaymentsPaymentMethodOptions.GCash,
    } as z.infer<typeof insertPaymentSchema>,
    validators: {
      onSubmit: insertPaymentSchema,
    },
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
    <form.AppForm>
      <FormDialog
        title="Want to create a new payment?"
        description="Enter the right information"
        open={!!search.new}
        onOpenChange={() =>
          navigate({ to: '/dashboard/payments', search: { new: undefined } })
        }
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        onClear={(e) => {
          e.preventDefault();
          form.reset();
        }}
      >
        <CreatePaymentForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreatePaymentDialogForm;
