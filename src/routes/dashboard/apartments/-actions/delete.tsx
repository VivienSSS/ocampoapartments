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
  deleteApartmentUnitMutation,
  listApartmentUnitsQuery,
  viewApartmentUnitQuery,
} from '@/pocketbase/queries/apartmentUnits';

const DeleteApartmentDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/apartments/' });
  const navigate = useNavigate({ from: '/dashboard/apartments' });
  const { queryClient } = useRouteContext({ from: '/dashboard/apartments/' });

  const { data: apt } = useQuery(
    {
      ...viewApartmentUnitQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    deleteApartmentUnitMutation(searchQuery.id ?? ''),
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
            Are you sure to delete apartment unit `{apt?.unitLetter}`
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
                      id: undefined,
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
