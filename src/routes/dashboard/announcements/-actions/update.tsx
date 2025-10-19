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
import { useAppForm } from '@/components/ui/form';
import {
  listAnnouncementsQuery,
  updateAnnouncementMutation,
  viewAnnouncementQuery,
} from '@/pocketbase/queries/announcements';
import { updateAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import { EditAnnouncementForm } from './form';

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

  const form = useAppForm({
    defaultValues: {
      title: ann?.title ?? '',
      message: ann?.message ?? '',
    } as z.infer<typeof updateAnnouncementSchema>,
    validators: { onChange: updateAnnouncementSchema },
    onSubmit: async ({ value }) =>
      mutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listAnnouncementsQuery(searchQuery.page, searchQuery.perPage),
          );
          navigate({
            to: '/dashboard/announcements',
            search: { edit: undefined, id: undefined },
          });
        },
      }),
  });

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <EditAnnouncementForm form={form} />
            <div className="mt-6">
              <form.SubmitButton>Update Announcement</form.SubmitButton>
            </div>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditAnnouncementDialogForm;
