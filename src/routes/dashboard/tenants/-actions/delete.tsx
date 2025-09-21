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
  deleteTenantMutation,
  listTenantsQuery,
  viewTenantQuery,
} from '@/pocketbase/queries/tenants';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';

const DeleteTenantDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/tenants/' });
  const navigate = useNavigate({ from: '/dashboard/tenants' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenants/' });

  const { data: tenant } = useQuery(
    {
      ...viewTenantQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    deleteTenantMutation(searchQuery.id ?? ''),
    queryClient,
  );

  return (
    <AlertDialog
      open={!!searchQuery.delete && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          search: (prev) => ({ ...prev, delete: undefined, id: undefined }),
        })
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to delete `{tenant?.expand.user.firstName}{' '}
            {tenant?.expand.user.lastName}`
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            tenant and remove their data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteMutation.mutate(undefined, {
                onSuccess: () => {
                  queryClient.invalidateQueries(
                    listTenantsQuery(searchQuery.page, searchQuery.perPage),
                  );
                  queryClient.invalidateQueries(
                    viewTenantQuery(searchQuery.id ?? ''),
                  );
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      delete: undefined,
                      id: undefined,
                    }),
                    reloadDocument: true,
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

export default DeleteTenantDialogForm;
