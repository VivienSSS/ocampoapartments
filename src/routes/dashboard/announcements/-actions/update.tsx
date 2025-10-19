import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  listAnnouncementsQuery,
  updateAnnouncementMutation,
  viewAnnouncementQuery,
} from '@/pocketbase/queries/announcements';
import { updateAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const EditAnnouncementDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/announcements' });
  const searchQuery = useSearch({ from: '/dashboard/announcements/' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/announcements/',
  });

  const mutation = useMutation(
    updateAnnouncementMutation(searchQuery.id ?? ''),
  );

  const { data: ann } = useQuery(
    {
      ...viewAnnouncementQuery(searchQuery.id ?? ''),
      enabled: !!searchQuery.id && searchQuery.edit,
    },
    queryClient,
  );

  return (
    <Dialog
      open={!!searchQuery.edit && !!searchQuery.id}
      onOpenChange={() =>
        navigate({
          to: '/dashboard/announcements',
          search: { edit: undefined, id: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit announcement</DialogTitle>
          <DialogDescription>Update information</DialogDescription>
        </DialogHeader>
        {ann && (
          <AutoForm
            onSubmit={(value: z.infer<typeof updateAnnouncementSchema>) =>
              mutation.mutate(value, {
                onSuccess: () => {
                  navigate({
                    to: '/dashboard/announcements',
                    search: { edit: undefined, id: undefined },
                  });
                },
              })
            }
            defaultValues={{
              title: ann.title,
              message: ann.message,
            }}
            schema={new ZodProvider(updateAnnouncementSchema)}
            withSubmit
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditAnnouncementDialogForm;
