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
  listMaintenanceRequestsQuery,
  updateMaintenanceRequestMutation,
  viewMaintenanceRequestQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import { updateMaintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import { EditMaintenanceForm } from './form';

const EditMaintenanceDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenances' });
  const searchQuery = useSearch({ from: '/dashboard/maintenances/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/maintenances/' });

  const currentId = searchQuery.id ?? searchQuery.selected[0];
  const mutation = useMutation(
    updateMaintenanceRequestMutation(currentId ?? ''),
  );

  const { data: req } = useQuery(
    {
      ...viewMaintenanceRequestQuery(currentId ?? ''),
      enabled: !!currentId && searchQuery.edit,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {
      description: req?.description ?? '',
      status: req?.status ?? '',
    } as z.infer<typeof updateMaintenanceRequestSchema>,
    validators: { onChange: updateMaintenanceRequestSchema },
    onSubmit: async ({ value }) =>
      mutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listMaintenanceRequestsQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({
            to: '/dashboard/maintenances',
            search: { edit: undefined, id: undefined },
          });
        },
      }),
  });

  return (
    <Dialog
      open={!!searchQuery.edit && !!currentId}
      onOpenChange={() =>
        navigate({
          search: (prev) => ({ ...prev, edit: undefined, id: undefined }),
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit maintenance request</DialogTitle>
          <DialogDescription>Update information</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <EditMaintenanceForm form={form} />
            <form.SubmitButton>Update Request</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaintenanceDialogForm;
