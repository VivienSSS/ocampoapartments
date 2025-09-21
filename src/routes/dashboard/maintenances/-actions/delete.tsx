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
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteMaintenanceRequestMutation,
  listMaintenanceRequestsQuery,
  viewMaintenanceRequestQuery,
} from '@/pocketbase/queries/maintenanceRequests';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';

const DeleteMaintenanceDialog = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenances' });
  const searchQuery = useSearch({ from: '/dashboard/maintenances/' });
  const { queryClient } = useRouteContext({ from: '/dashboard/maintenances/' });

  const { data: req } = useQuery(
    {
      ...viewMaintenanceRequestQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.delete,
    },
    queryClient,
  );

  const mutation = useMutation(
    deleteMaintenanceRequestMutation(searchQuery.id ?? ''),
  );

  return (
    <AlertDialog
      open={!!searchQuery.delete && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          to: '/dashboard/maintenances',
          search: { delete: undefined, id: undefined },
        })
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete maintenance request</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the request by{' '}
            {req?.reporterName ?? 'this user'}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              mutation.mutate(undefined, {
                onSuccess: () => {
                  queryClient.invalidateQueries(
                    listMaintenanceRequestsQuery(
                      searchQuery.page,
                      searchQuery.perPage,
                    ),
                  );
                  navigate({
                    to: '/dashboard/maintenances',
                    search: { delete: undefined, id: undefined },
                  });
                },
              })
            }
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteMaintenanceDialog;
