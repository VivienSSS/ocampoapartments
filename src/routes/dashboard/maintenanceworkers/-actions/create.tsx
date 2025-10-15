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
import {
  createMaintenanceWorkerMutation,
  listMaintenanceWorkersQuery,
} from '@/pocketbase/queries/maintenanceWorkers';
import { insertMaintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const CreateWorkerDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenanceworkers' });
  const searchParams = useSearch({ from: '/dashboard/maintenanceworkers/' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/maintenanceworkers/',
  });

  const maintenanceWorkerMutation = useMutation(createMaintenanceWorkerMutation);

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
        <AutoForm schema={new ZodProvider(insertMaintenanceWorkerSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkerDialogForm;
