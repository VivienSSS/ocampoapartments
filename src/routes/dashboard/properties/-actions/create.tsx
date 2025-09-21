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
import { insertPropertySchema } from '@/pocketbase/schemas/properties';
import { Collections } from '@/pocketbase/types';
import { CreatePropertyForm } from './form';

const CreatePropertyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/properties' });

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertPropertySchema>,
    validators: {
      onChange: insertPropertySchema,
    },
    onSubmit: async ({ value }) => {
      await pb.collection(Collections.Properties).create(value); // if error, will not continue below

      navigate({ to: '/dashboard/properties' });
    },
  });

  return (
    <Dialog>
      <DialogTrigger>Create Property</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new property</DialogTitle>
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
            <CreatePropertyForm form={form} />
            <form.SubmitButton>Create property</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePropertyDialogForm;
