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
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import {
  deleteBillMutation,
  listBillsQuery,
  viewBillQuery,
} from '@/pocketbase/queries/bills';

const DeleteBillingDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/billing/' });
  const navigate = useNavigate({ from: '/dashboard/billing' });
  const { queryClient } = useRouteContext({ from: '/dashboard/billing/' });

  const { data: bill } = useQuery(
    {
      ...viewBillQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    deleteBillMutation(searchQuery.id ?? ''),
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
            Are you absolutely sure to delete `{bill?.id}`
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the bill.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              deleteMutation.mutate(undefined, {
                onSuccess: () => {
                  queryClient.invalidateQueries(
                    listBillsQuery(searchQuery.page, searchQuery.perPage),
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

export default DeleteBillingDialogForm;
