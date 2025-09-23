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
  deletePropertyMutation,
  viewPropertiesQuery,
} from '@/pocketbase/queries/properties';

const DeletePropertyDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/properties/' });
  const navigate = useNavigate({ from: '/dashboard/properties' });
  const { queryClient } = useRouteContext({ from: '/dashboard/properties/' });

  const { data: property } = useQuery(
    {
      ...viewPropertiesQuery(searchQuery.id!),
      enabled: !!searchQuery.id && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    deletePropertyMutation(searchQuery.id!),
    queryClient,
  );

  return (
    <AlertDialog
      open={searchQuery.delete && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          search: (prev) => ({ ...prev, delete: undefined, id: undefined }),
        })
      }
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure to delete `{property?.address}`
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteMutation.mutate(undefined, {
                onSuccess: () => {
                  queryClient.invalidateQueries(
                    viewPropertiesQuery(searchQuery.id!),
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

export default DeletePropertyDialogForm;
