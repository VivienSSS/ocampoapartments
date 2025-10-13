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
  listBillsQuery,
  updateBillMutation,
  viewBillQuery,
} from '@/pocketbase/queries/bills';
import { updateBillSchema } from '@/pocketbase/schemas/bills';
import { EditBillingForm } from './form';

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

  const form = useAppForm({
    defaultValues: {
      status: bill?.status ?? '',
    } as z.infer<typeof updateBillSchema>,
    validators: {
      onChange: updateBillSchema,
    },
    onSubmit: async ({ value }) =>
      billMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listBillsQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({
            to: '/dashboard/billing',
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <EditBillingForm form={form} />
            <div className="mt-6">
              <form.SubmitButton>Update Bill</form.SubmitButton>
            </div>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBillingDialogForm;
