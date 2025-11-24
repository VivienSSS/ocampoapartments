import { useMutation } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';
import { useAppForm } from '@/components/ui/forms';
import FormDialog from '@/components/ui/forms/utils/dialog';
import { pb } from '@/pocketbase';
import {
  createAnnouncementMutation,
  listAnnouncementsQuery,
} from '@/pocketbase/queries/announcements';
import { insertAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import AutoFieldSet from '@/components/ui/autoform';

const CreateAnnouncementDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/announcements' });
  const searchParams = useSearch({ from: '/dashboard/announcements/' });
  const { queryClient, pocketbase } = useRouteContext({
    from: '/dashboard/announcements/',
  });

  const announcementMutation = useMutation(createAnnouncementMutation);

  const form = useAppForm({
    defaultValues: {
      author: pocketbase.authStore.record?.id || '',
      message: '',
      title: '',
    } as z.infer<typeof insertAnnouncementSchema>,
    validators: {
      onSubmit: insertAnnouncementSchema,
    },
    onSubmit: async ({ value }) =>
      announcementMutation.mutateAsync(
        { ...value, author: pb.authStore.record?.id || '' },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(
              listAnnouncementsQuery(searchParams.page, searchParams.perPage),
            );
            navigate({
              to: '/dashboard/announcements',
              search: { new: undefined },
            });
          },
        },
      ),
  });

  return (
    <form.AppForm>
      <FormDialog
        open={searchParams.new}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/announcements',
            search: { new: undefined },
          })
        }
        title={'Want to add a new announcement?'}
        description={'Enter the right information'}
        onClear={(e) => {
          e.preventDefault();
          form.reset();
        }}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {/* <CreateAnnouncementForm form={form} /> */}
        <AutoFieldSet
          form={form}
          schema={{
            groups: [
              {
                name: 'title',
                type: 'text',
                label: 'Title',
                description: 'Title of the announcement',
                orientation: 'vertical',
              },
              {
                name: 'message',
                type: 'textarea',
                label: 'Message',
                description: 'Content of the announcement',
                orientation: 'vertical',
              },
            ],
          }}
        />
      </FormDialog>
    </form.AppForm>
  );
};

export default CreateAnnouncementDialogForm;
