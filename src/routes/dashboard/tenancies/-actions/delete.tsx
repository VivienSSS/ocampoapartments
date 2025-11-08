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
import { listApartmentUnitsQuery } from '@/pocketbase/queries/apartmentUnits';
import {
  batchDeleteTenancyMutation,
  inTenanciesQuery,
  listTenanciesQuery,
} from '@/pocketbase/queries/tenancies';

const DeleteTenancyDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/tenancies/' });
  const navigate = useNavigate({ from: '/dashboard/tenancies' });
  const { queryClient } = useRouteContext({ from: '/dashboard/tenancies/' });

  const { data: tenancies } = useQuery(
    {
      ...inTenanciesQuery(searchQuery.selected ?? []),
      enabled: !!searchQuery.selected?.length && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    batchDeleteTenancyMutation(searchQuery.selected ?? []),
    queryClient,
  );

  return (
    <AlertDialog
      open={!!searchQuery.delete && !!searchQuery.selected?.length}
      onOpenChange={() =>
        navigate({
          search: (prev) => ({ ...prev, delete: undefined }),
        })
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure to delete{' '}
            {tenancies
              ?.map(
                (record) =>
                  `\`${record.expand.tenant.expand.user.firstName} ${record.expand.tenant.expand.user.lastName}\``,
              )
              .join(',')}
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
                  queryClient.invalidateQueries(
                    listTenanciesQuery(searchQuery.page, searchQuery.perPage),
                  );
                  // Invalidate apartment units to refresh availability status
                  queryClient.invalidateQueries(
                    listApartmentUnitsQuery(1, 500),
                  );
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      delete: undefined,
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

export default DeleteTenancyDialogForm;
