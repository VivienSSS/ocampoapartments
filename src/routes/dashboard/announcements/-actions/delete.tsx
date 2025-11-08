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
  batchDeleteAnnouncementMutation,
  deleteAnnouncementMutation,
  inAnnouncementsQuery,
  listAnnouncementsQuery,
  viewAnnouncementQuery,
} from '@/pocketbase/queries/announcements';

const DeleteAnnouncementDialogForm = () => {
  const searchQuery = useSearch({ from: '/dashboard/announcements/' });
  const navigate = useNavigate({ from: '/dashboard/announcements' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/announcements/',
  });

  const { data: ann } = useQuery(
    {
      ...inAnnouncementsQuery(searchQuery.selected),
      enabled: !!searchQuery.selected && searchQuery.delete,
    },
    queryClient,
  );

  const deleteMutation = useMutation(
    batchDeleteAnnouncementMutation(searchQuery.selected),
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
            {ann?.map((record) => `\`${record.title}\``).join(',')}
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
                    listAnnouncementsQuery(
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

export default DeleteAnnouncementDialogForm;
