import { useMutation, useQuery } from '@tanstack/react-query';
import {
  useNavigate,
  useRouteContext,
  useSearch,
} from '@tanstack/react-router';
import type z from 'zod';

import { useAppForm } from '@/components/ui/forms';
import FormDialog from '@/components/ui/forms/utils/dialog';
import {
  listAnnouncementsQuery,
  updateAnnouncementMutation,
  viewAnnouncementQuery,
} from '@/pocketbase/queries/announcements';
import { updateAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import { UpdateAnnouncementForm } from './form';

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
    validators: { onSubmit: updateAnnouncementSchema },
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
    <form.AppForm>
      <FormDialog
        open={!!searchQuery.edit && !!searchQuery.id}
        onOpenChange={() =>
          navigate({
            to: '/dashboard/announcements',
            search: { edit: undefined, id: undefined },
          })
        }
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        onClear={(e) => {
          e.preventDefault();
          form.reset();
        }}
        title={'Edit announcement'}
        description={'Update Information'}
      >
        <UpdateAnnouncementForm form={form} />
      </FormDialog>
    </form.AppForm>
  );
};

export default EditAnnouncementDialogForm;
