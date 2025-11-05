import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  batchDeleteMaintenanceRequestMutation,
  inMaintenanceRequestsQuery,
  listMaintenanceRequestsQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import { pb } from '@/pocketbase';
import { UsersRoleOptions } from '@/pocketbase/types';

const DeleteMaintenanceDialog = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenances' });
  const searchQuery = useSearch({ from: '/dashboard/maintenances/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/maintenances/' });

  const userRole = pb.authStore.record?.role;
  const userId = pb.authStore.record?.id;
  const isTenant = userRole === UsersRoleOptions.Tenant;

  const { data: reqs } = useQuery(
    {
      ...inMaintenanceRequestsQuery(searchQuery.selected),
      enabled: !!searchQuery.selected && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    batchDeleteMaintenanceRequestMutation(searchQuery.selected),
    queryClient,
  );

  return (
    <AlertDialog
      open={!!searchQuery.delete && !!searchQuery.selected}
      onOpenChange={() =>
        navigate({
          search: (prev) => ({ ...prev, delete: undefined }),
        })
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete {reqs?.map((record) => `\`${record.description}\``).join(',')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteMutation.mutate(undefined, {
                onSuccess: () => {
                  // Determine tenant filter if user is a tenant
                  let tenantFilter: string | undefined;
                  if (isTenant && userId) {
                    tenantFilter = `tenant.user = '${userId}'`;
                  }

                  queryClient.invalidateQueries(
                    listMaintenanceRequestsQuery(
                      searchQuery.page,
                      searchQuery.perPage,
                      undefined,
                      tenantFilter
                    ),
                  );
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      delete: undefined,
                      selected: []
                    }),
                  });
                },
              })
            }
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMaintenanceDialog;
