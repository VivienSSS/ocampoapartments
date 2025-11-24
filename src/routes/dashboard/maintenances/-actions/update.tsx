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
import { pb } from '@/pocketbase';
import {
  listMaintenanceRequestsQuery,
  updateMaintenanceRequestMutation,
  viewMaintenanceRequestQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import { updateMaintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import { UsersRoleOptions } from '@/pocketbase/types';
import { EditMaintenanceForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

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
    validators: { onSubmit: updateMaintenanceRequestSchema },
    onSubmit: async ({ value }) => {
      // Automatically set completedDate when status is Completed
      const submitValue = {
        ...value,
        ...(value.status === 'Completed' && !req?.completedDate
          ? { completedDate: new Date() }
          : {}),
      };

      return mutation.mutateAsync(submitValue, {
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
      });
    },
  });

  return (
    <form.AppForm>
      <FormDialog
        title="Edit Maintenance Request"
        description="Update information"
        open={!!searchQuery.edit && !!currentId}
        onOpenChange={() =>
          navigate({
            search: (prev) => ({ ...prev, edit: undefined, id: undefined }),
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
        <EditMaintenanceForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default EditMaintenanceDialogForm;
