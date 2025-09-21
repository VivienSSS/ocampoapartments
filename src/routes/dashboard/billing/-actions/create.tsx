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
import { insertBillSchema } from '@/pocketbase/schemas/bills';
import { CreateBillingForm } from './form';
import { createBillMutation, listBillsQuery } from '@/pocketbase/queries/bills';

const CreateBillingDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/billing' });
  const searchParams = useSearch({ from: '/dashboard/billing/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/billing/' });

  const billMutation = useMutation(createBillMutation);

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertBillSchema>,
    validators: {
      onChange: insertBillSchema,
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
    <Dialog
      open={searchParams.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/billing', search: { new: undefined } })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create billing</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <CreateBillingForm form={form} />
            <form.SubmitButton>Create Billing</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBillingDialogForm;
