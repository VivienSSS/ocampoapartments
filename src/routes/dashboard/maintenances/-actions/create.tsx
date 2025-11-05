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
  createMaintenanceRequestMutation,
  listMaintenanceRequestsQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import { insertMaintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import { CreateMaintenanceForm } from './form';
import { pb } from '@/pocketbase';
import { UsersRoleOptions } from '@/pocketbase/types';

const CreateMaintenanceDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenances' });
  const searchParams = useSearch({ from: '/dashboard/maintenances/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/maintenances/' });

  const userRole = pb.authStore.record?.role;
  const userId = pb.authStore.record?.id;
  const isTenant = userRole === UsersRoleOptions.Tenant;

  const maintenanceMutation = useMutation(createMaintenanceRequestMutation);

  const form = useAppForm({
    defaultValues: {
      status: 'pending',
    } as unknown as z.infer<typeof insertMaintenanceRequestSchema>,
    validators: {
      onChange: insertMaintenanceRequestSchema,
    },
    onSubmit: async ({ value }) =>
      maintenanceMutation.mutateAsync(value, {
        onSuccess: () => {
          // Determine tenant filter if user is a tenant
          let tenantFilter: string | undefined;
          if (isTenant && userId) {
            tenantFilter = `tenant.user = '${userId}'`;
          }

          queryClient.invalidateQueries(
            listMaintenanceRequestsQuery(
              searchParams.page,
              searchParams.perPage,
              undefined,
              tenantFilter
            ),
          );
          navigate({
            to: '/dashboard/maintenances',
            search: { new: undefined },
          });
        },
      }),
  });

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
        <form
          className="grid grid-cols-4 gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <CreateMaintenanceForm form={form} />
            <form.SubmitButton className="col-span-full mt-4">
              Create Request
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintenanceDialogForm;
