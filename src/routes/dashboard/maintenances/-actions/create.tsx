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
  createMaintenanceRequestMutation,
  listMaintenanceRequestsQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import { insertMaintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';
import { insertMaintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';

const CreateMaintenanceDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenances' });
  const searchParams = useSearch({ from: '/dashboard/maintenances/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/maintenances/' });

  const maintenanceMutation = useMutation(createMaintenanceRequestMutation);

  return (
    <Dialog
      open={searchParams.new}
      onOpenChange={() =>
        navigate({ to: '/dashboard/maintenances', search: { new: undefined } })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Want to add a new request?</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(insertMaintenanceWorkerSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintenanceDialogForm;
