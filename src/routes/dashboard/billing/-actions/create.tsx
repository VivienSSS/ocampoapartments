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
import { insertBillSchema } from '@/pocketbase/schemas/bills';
import { Collections } from '@/pocketbase/types';
import { CreateBillingForm } from './form';

const CreateBillingDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/billing' });

  const form = useAppForm({
    defaultValues: {} as z.infer<typeof insertBillSchema>,
    validators: {
      onChange: insertBillSchema,
    },
    onSubmit: async ({ value }) => {
      await pb.collection(Collections.Bills).create(value); // if error, will not continue below

      navigate({ to: '/dashboard/billing' });
    },
  });

  return (
    <Dialog>
      <DialogTrigger>Create Billing</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create billing</DialogTitle>
          <DialogDescription>Enter the right information</DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.AppForm>
            <CreateBillingForm form={form} />
            <form.SubmitButton>Create Billing</form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBillingDialogForm;
