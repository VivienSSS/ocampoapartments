import { useMutation } from '@tanstack/react-query';
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
import { pb } from '@/pocketbase';
import {
  createAnnouncementMutation,
  listAnnouncementsQuery,
} from '@/pocketbase/queries/announcements';
import { insertAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import { AnnouncementForm } from './form';
import FormDialog from '@/components/ui/form-dialog';

const CreateAnnouncementDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/announcements' });
  const searchParams = useSearch({ from: '/dashboard/announcements/' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/announcements/',
  });

  const announcementMutation = useMutation(createAnnouncementMutation);

  const form = useAppForm({
    defaultValues: {
      title: '',
      message: '',
      author: pb.authStore.record?.id,
    } as z.infer<typeof insertAnnouncementSchema>,
    onSubmit: async ({ value }) =>
      announcementMutation.mutateAsync(value, {
        onSuccess: () => {
          queryClient.invalidateQueries(
            listAnnouncementsQuery(searchParams.page, searchParams.perPage),
          );
          navigate({
            to: '/dashboard/announcements',
            search: { new: undefined },
          });
        },
      }),
  });

  return (
    <FormDialog
      open={searchParams.new}
      onOpenChange={() =>
        navigate({
          to: '/dashboard/announcements',
          search: { new: undefined },
        })
      }
      onSubmit={(e) => {
        form.handleSubmit()
      }}
      title={"Want to add a new announcement?"}
      description={"Enter the right information"}
      className='grid grid-cols-4 gap-5'
    >
      <form.AppForm>
        <AnnouncementForm form={form as any} />
        <form.SubmitButton className="col-span-full">
          Create Announcement
        </form.SubmitButton>
      </form.AppForm>
    </FormDialog>
  );
};

export default CreateAnnouncementDialogForm;
