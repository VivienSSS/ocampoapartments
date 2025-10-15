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
import {
  createAnnouncementMutation,
  listAnnouncementsQuery,
} from '@/pocketbase/queries/announcements';
import { insertAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import { AutoForm } from '@/components/ui/autoform';
import { ZodProvider } from '@autoform/zod';

const CreateAnnouncementDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/announcements' });
  const searchParams = useSearch({ from: '/dashboard/announcements/' });
  const { queryClient } = useRouteContext({
    from: '/dashboard/announcements/',
  });

  const announcementMutation = useMutation(createAnnouncementMutation);

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
        <AutoForm onSubmit={(v: z.infer<typeof insertAnnouncementSchema>) => {

        }} schema={new ZodProvider(insertAnnouncementSchema)} withSubmit />
      </DialogContent>
    </Dialog>
  );
};

export default CreateAnnouncementDialogForm;
