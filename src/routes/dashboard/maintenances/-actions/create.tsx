import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/forms';
import { pb } from '@/pocketbase';
import {
  createMaintenanceRequestMutation,
  listMaintenanceRequestsQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';
import { insertMaintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import { Collections, UsersRoleOptions } from '@/pocketbase/types';
import { CreateMaintenanceForm } from './form';
import FormDialog from '@/components/ui/forms/utils/dialog';

const CreateMaintenanceDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenances' });
  const searchParams = useSearch({ from: '/dashboard/maintenances/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/maintenances/' });

  const userRole = pb.authStore.record?.role;
  const userId = pb.authStore.record?.id;
  const isTenant = userRole === UsersRoleOptions.Tenant;

  // Fetch tenant ID if user is a tenant
  const { data: tenantData } = useQuery({
    queryKey: ['currentTenant', userId],
    queryFn: async () => {
      if (!isTenant || !userId) return null;
      const tenants = await pb
        .collection(Collections.Tenants)
        .getFullList<TenantsResponse>({
          filter: `user = '${userId}'`,
          requestKey: null,
        });
      return tenants.length > 0 ? tenants[0] : null;
    },
    enabled: isTenant && !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  const maintenanceMutation = useMutation(createMaintenanceRequestMutation);

  const form = useAppForm({
    defaultValues: {
      status: 'Pending',
      ...(isTenant && tenantData ? { tenant: tenantData.id } : {}),
    } as unknown as z.infer<typeof insertMaintenanceRequestSchema>,
    validators: {
      onSubmit: insertMaintenanceRequestSchema,
    },
    onSubmit: async ({ value }) => {
      // For tenants, ensure tenant field is set
      const submitValue =
        isTenant && tenantData ? { ...value, tenant: tenantData.id } : value;
      return maintenanceMutation.mutateAsync(submitValue, {
        onSuccess: () => {
          // Determine tenant filter if user is a tenant
          let tenantFilter: string | undefined;
          if (isTenant && userId) {
            tenantFilter = `tenant.user = '${userId}'`;
          }

          queryClient.invalidateQueries(
            listMaintenanceRequestsQuery(
              searchParams.page,
              3,
              undefined,
              tenantFilter,
            ),
          );

          navigate({
            to: '/dashboard/maintenances',
            search: { new: undefined },
          });
        },
      });
    },
  });

  return (
    <form.AppForm>
      <FormDialog
        title="Want to add a new request?"
        description="Enter the right information"
        open={searchParams.new}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/maintenances',
            search: { new: undefined },
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
        <CreateMaintenanceForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreateMaintenanceDialogForm;
