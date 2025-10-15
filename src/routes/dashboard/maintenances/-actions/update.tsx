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
import {
  listMaintenanceRequestsQuery,
  updateMaintenanceRequestMutation,
  viewMaintenanceRequestQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import { updateMaintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

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
          <DialogTitle>Edit Request</DialogTitle>
          <DialogDescription>Update information</DialogDescription>
        </DialogHeader>
        <AutoForm schema={new ZodProvider(updateMaintenanceRequestSchema)} />
      </DialogContent>
    </Dialog>
  );
};

export default EditMaintenanceDialogForm;
