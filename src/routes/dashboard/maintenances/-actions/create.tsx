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
import { insertMaintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import {
  Collections,
  MaintenanceRequestsStatusOptions,
} from '@/pocketbase/types';
import { CreatePropertyForm } from '../../properties/-actions/form';
import { CreateMaintenanceForm } from './form';

const CreateMaintenanceDialogForm = () => {
  const navigate = useNavigate({ from: '/dashboard/maintenances' });

  const form = useAppForm({
    defaultValues: {
      status: MaintenanceRequestsStatusOptions.Pending,
    } as z.infer<typeof insertMaintenanceRequestSchema>,
    validators: {
      onChange: insertMaintenanceRequestSchema,
    },
    onSubmit: async ({ value }) => {
      await pb.collection(Collections.MaintenanceRequests).create(value); // if error, will not continue below

      navigate({ to: '/dashboard/maintenances' });
    },
  });

  return (
    <Dialog>
      <DialogTrigger>Create Maintenance Request</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new request</DialogTitle>
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
            <CreateMaintenanceForm form={form} />
            <form.SubmitButton className="col-span-full">
              Create a maintenance request
            </form.SubmitButton>
          </form.AppForm>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMaintenanceDialogForm;
