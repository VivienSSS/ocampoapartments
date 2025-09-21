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
import { insertAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import { CreateAnnouncementForm } from './form';
import {
  createAnnouncementMutation,
  listAnnouncementsQuery,
} from '@/pocketbase/queries/announcements';

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
      author: '',
    } as z.infer<typeof insertAnnouncementSchema>,
    validators: {
      onChange: insertAnnouncementSchema,
    },
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
    <Dialog
      open={searchParams.new}
      onOpenChange={() =>
        navigate({
          to: '/dashboard/announcements',
          search: { new: undefined },
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new announcement</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <form
          className="grid grid-cols-4 gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <CreateAnnouncementForm form={form} />
            <form.SubmitButton className="col-span-full">
              Create announcement
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnouncementDialogForm;
