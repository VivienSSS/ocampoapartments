import { useNavigate } from '@tanstack/react-router';
import React from 'react';
import type z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAppForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import { insertAnnouncementSchema } from '@/pocketbase/schemas/announcements';
import { Collections } from '@/pocketbase/types';
import { CreateAnnouncementForm } from './form';

const CreateAnnouncementDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/announcements' });

  const form = useAppForm({
    defaultValues: {
      author: pb.authStore.record?.id,
    } as z.infer<typeof insertAnnouncementSchema>,
    validators: {
      onChange: insertAnnouncementSchema,
    },
    onSubmit: async ({ value }) => {
      await pb.collection(Collections.Announcements).create(value);

      navigate({ to: '/dashboard/announcements' });
    },
  });

  return (
    <Dialog>
      <DialogTrigger>Create Announcement</DialogTrigger>
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
