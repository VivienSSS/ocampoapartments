import { useMutation } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/forms';
import {
  createMaintenanceWorkerMutation,
  listMaintenanceWorkersQuery,
} from '@/pocketbase/queries/maintenanceWorkers';
import type { insertMaintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { CreateWorkersForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const CreateWorkerDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
  const searchParams = useSearch({ from: '/dashboard/maintenanceworkers/' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/maintenanceworkers/',
  });

  const maintenanceWorkerMutation = useMutation(
    createMaintenanceWorkerMutation,
  );

  const form = useAppForm({
    defaultValues: {
      name: '',
      contactDetails: '',
      isAvailable: true,
    } as z.infer<typeof insertMaintenanceWorkerSchema>,
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
            search: { new: undefined },
          });
        },
      }),
  });

  return (
    <form.AppForm>
      <FormDialog
        open={searchParams.new}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/maintenanceworkers',
            search: { new: undefined },
          })
        }
        title="Want to add a new worker?"
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
        <CreateWorkersForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreateWorkerDialogForm;
