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
import { pb } from '@/pocketbase';
import { createAnnouncementMutation } from '@/pocketbase/queries/announcements';
import { insertAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import { Collections } from '@/pocketbase/types';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const CreateAnnouncementDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/announcements' });
  const searchParams = useSearch({ from: '/dashboard/announcements/' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/announcements/',
  });

  const announcementMutation = useMutation({
    ...createAnnouncementMutation,
    onSuccess: () => {
      // Invalidate and refetch the announcements list
      queryClient.invalidateQueries({
        queryKey: [Collections.Announcements],
      });
      // Close the dialog
      navigate({
        to: '/dashboard/announcements',
        search: { new: undefined },
      });
    },
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
          <DialogTitle>Want to add a new announcement?</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <AutoForm
          onSubmit={(v: z.infer<typeof insertAnnouncementSchema>) => {
            // Add the current user's ID as the author
            const announcementData = {
              ...v,
              author: pb.authStore.model?.id || '',
            };
            announcementMutation.mutate(announcementData);
          }}
          schema={new ZodProvider(insertAnnouncementSchema)}
          withSubmit
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnouncementDialogForm;
