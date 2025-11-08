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
  deactivateTenantMutation,
  inTenantsQuery,
  listTenantsQuery,
} from '@/pocketbase/queries/tenants';

const DeactivateTenantDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/tenants/' });
  const navigate = useNavigate({ from: '/dashboard/tenants' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenants/' });

  const { data: tenants } = useQuery(
    {
      ...inTenantsQuery(searchQuery.selected),
      enabled: !!searchQuery.selected && searchQuery.deactivate,
    },
    queryClient,
  );

  const deactivateMutation = useMutation(
    deactivateTenantMutation(searchQuery.selected?.[0] || ''),
    queryClient,
  );

  return (
    <AlertDialog
      open={!!searchQuery.deactivate && !!searchQuery.selected}
      onOpenChange={() =>
        navigate({
          search: (prev) => ({ ...prev, deactivate: undefined }),
        })
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to deactivate{' '}
            {tenants
              ?.map(
                (record) =>
                  `\`${record.expand.user.firstName} ${record.expand.user.lastName}\``,
              )
              .join(',')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            The tenant will be marked as inactive and will not be able to access
            the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deactivateMutation.mutate(undefined, {
                onSuccess: () => {
                  queryClient.invalidateQueries(
                    listTenantsQuery(searchQuery.page, searchQuery.perPage),
                  );
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      deactivate: undefined,
                      selected: [],
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

export default DeactivateTenantDialogForm;
