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
  batchDeleteApartmentUnitMutation,
  inApartmentUnitsQuery,
  listApartmentUnitsQuery,
} from '@/pocketbase/queries/apartmentUnits';

const DeleteApartmentDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/apartments/' });
  const navigate = useNavigate({ from: '/dashboard/apartments' });
  const { queryClient } = useRouteContext({ from: '/dashboard/apartments/' });

  const { data: apt } = useQuery(
    {
      ...inApartmentUnitsQuery(searchQuery.selected),
      enabled: !!searchQuery.selected && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    batchDeleteApartmentUnitMutation(searchQuery.selected),
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
            Are you sure to delete{' '}
            {apt?.map((record) => `\`${record.unitLetter}\``).join(',')}
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
                    listApartmentUnitsQuery(
                      searchQuery.page,
                      searchQuery.perPage,
                    ),
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

export default DeleteApartmentDialogForm;
