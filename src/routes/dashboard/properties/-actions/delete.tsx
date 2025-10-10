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
  batchDeletePropertyMutation,
  inPropertiesQuery,
  listPropertiesQuery,
} from '@/pocketbase/queries/properties';

const DeletePropertyDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/properties/' });
  const navigate = useNavigate({ from: '/dashboard/properties' });
  const { queryClient } = useRouteContext({ from: '/dashboard/properties/' });

  const { data: properties } = useQuery(
    {
      ...inPropertiesQuery(searchQuery.selected),
      enabled: !!searchQuery.selected && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    batchDeletePropertyMutation(searchQuery.selected),
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
            Are you sure to delete {properties?.map((record) => `\`${record.address}\``).join(',')}
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
                    listPropertiesQuery(searchQuery.page, searchQuery.perPage),
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

export default DeletePropertyDialogForm;
