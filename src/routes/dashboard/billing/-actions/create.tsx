import { useMutation } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/forms';
import { createBillMutation, listBillsQuery } from '@/pocketbase/queries/bills';
import { insertBillSchema } from '@/pocketbase/schemas/bills';
import { CreateBillingForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const CreateBillingDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/billing' });
  const searchParams = useSearch({ from: '/dashboard/billing/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/billing/' });

  const billMutation = useMutation(createBillMutation);

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertBillSchema>,
    validators: {
      onSubmit: insertBillSchema,
    },
    onSubmit: async ({ value }) =>
      billMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listBillsQuery(searchParams.page, searchParams.perPage),
          );
          navigate({ to: '/dashboard/billing', search: { new: undefined } });
        },
      }),
  });

  return (
    <form.AppForm>
      <FormDialog
        title={'Want to add a new billing to a tenant?'}
        description={'Enter the right information'}
        open={searchParams.new}
        onOpenChange={() =>
          navigate({ to: '/dashboard/billing', search: { new: undefined } })
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
        <CreateBillingForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreateBillingDialogForm;
