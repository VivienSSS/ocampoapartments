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
import { insertTenanciesSchema } from '@/pocketbase/schemas/tenancies';
import { Collections } from '@/pocketbase/types';
import { CreateTenancyForm } from './form';

// import { CreateTenantForm } from './form'

const CreateTenancyDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/tenancies' });

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertTenanciesSchema>,
    validators: {
      onChange: insertTenanciesSchema,
    },

    onSubmit: async ({ value }) => {
      await pb.collection(Collections.Tenancies).create(value);

      navigate({ to: '/dashboard/tenancies' });
    },
  });

  return (
    <Dialog>
      <DialogTrigger>Create Tenancy</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create tenancy</DialogTitle>
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
            <CreateTenancyForm form={form} />
            <form.SubmitButton className="col-span-full">
              Create Tenancy
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTenancyDialogForm;
