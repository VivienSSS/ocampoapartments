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
import { useAppForm } from '@/components/ui/forms';
import {
  listMaintenanceWorkersQuery,
  updateMaintenanceWorkerMutation,
  viewMaintenanceWorkerQuery,
} from '@/pocketbase/queries/maintenanceWorkers';
import { type updateMaintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { EditWorkersForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const EditWorkerDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
  const searchParams = useSearch({ from: '/dashboard/maintenanceworkers/' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/maintenanceworkers/',
  });

  const maintenanceWorkerMutation = useMutation(
    updateMaintenanceWorkerMutation(searchParams.id ?? ''),
  );

  const { data: worker } = useQuery(
    {
      ...viewMaintenanceWorkerQuery(searchParams.id ?? ''),
      enabled: searchParams.new && !!searchParams.id,
    },
    queryClient,
  );

  const form = useAppForm({
    defaultValues: {
      name: worker?.name,
      contactDetails: worker?.contactDetails,
      isAvailable: worker?.isAvailable,
    } as z.infer<typeof updateMaintenanceWorkerSchema>,
    onSubmit: async ({ value }) =>
      maintenanceWorkerMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listMaintenanceWorkersQuery(
              searchParams.page,
              searchParams.perPage,
            ),
          );
          navigate({
            to: '/dashboard/maintenanceworkers',
            search: { edit: undefined, id: undefined },
          });
        },
      }),
  });

  return (
    <form.AppForm>
      <FormDialog
        open={searchParams.edit}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/maintenanceworkers',
            search: { edit: undefined, id: undefined },
          })
        }
        title="Edit Worker"
        description="Enter the right information"
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
        <EditWorkersForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default EditWorkerDialogForm;
