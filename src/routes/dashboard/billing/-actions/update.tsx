import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/forms';
import {
  listBillsQuery,
  updateBillMutation,
  viewBillQuery,
} from '@/pocketbase/queries/bills';
import { updateBillSchema } from '@/pocketbase/schemas/bills';
import { EditBillingForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

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
    <form.AppForm>
      <FormDialog
        title={'Edit Bill'}
        description={'Update billing information'}
        open={!!searchQuery.edit && !!searchQuery.id}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/billing',
            search: { edit: undefined, id: undefined },
          })
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
        <EditBillingForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default EditBillingDialogForm;
