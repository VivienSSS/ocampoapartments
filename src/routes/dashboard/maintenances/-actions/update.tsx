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
import { pb } from '@/pocketbase';
import {
  listMaintenanceRequestsQuery,
  updateMaintenanceRequestMutation,
  viewMaintenanceRequestQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import { updateMaintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import { UsersRoleOptions } from '@/pocketbase/types';
import { EditMaintenanceForm } from './form';

const EditMaintenanceDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenances' });
  const searchQuery = useSearch({ from: '/dashboard/maintenances/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/maintenances/' });

  const userRole = pb.authStore.record?.role;
  const userId = pb.authStore.record?.id;
  const isTenant = userRole === UsersRoleOptions.Tenant;

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
          // Determine tenant filter if user is a tenant
          let tenantFilter: string | undefined;
          if (isTenant && userId) {
            tenantFilter = `tenant.user = '${userId}'`;
          }

          queryClient.invalidateQueries(
            listMaintenanceRequestsQuery(
              searchQuery.page,
              3,
              undefined,
              tenantFilter,
            ),
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
          <DialogTitle>Edit Request</DialogTitle>
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
            <form.SubmitButton className="mt-4">
              Update Request
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMaintenanceDialogForm;
