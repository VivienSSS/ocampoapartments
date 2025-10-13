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
  createMaintenanceWorkerMutation,
  listMaintenanceWorkersQuery,
} from '@/pocketbase/queries/maintenanceWorkers';
import { insertMaintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { CreateWorkersForm } from './form';

const CreateWorkerDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
  const searchParams = useSearch({ from: '/dashboard/maintenanceworkers/' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/maintenanceworkers/',
  });

  const maintenanceWorkerMutation = useMutation(createMaintenanceWorkerMutation);

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
            listMaintenanceWorkersQuery(searchParams.page, searchParams.perPage),
          );
          navigate({
            to: '/dashboard/maintenanceworkers',
            search: { new: undefined },
          });
        },
      }),
  });

  return (
    <Dialog
      open={searchParams.new}
      onOpenChange={() =>
        navigate({
          to: '/dashboard/maintenanceworkers',
          search: { new: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to add a new worker?</DialogTitle>
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
            <CreateWorkersForm form={form} />
            <form.SubmitButton className="col-span-full">
              Create Worker
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkerDialogForm;
