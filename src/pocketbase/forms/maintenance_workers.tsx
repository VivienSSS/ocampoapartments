import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const MaintenanceWorkerForm = () =>
  withForm({
    defaultValues: {} as Update<'maintenance_workers'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="name">
                {(field) => (
                  <field.TextField
                    label="Name"
                    placeholder="Enter Worker Name"
                    tooltip="Full name of the maintenance worker"
                  />
                )}
              </form.AppField>
              <form.AppField name="contactDetails">
                {(field) => (
                  <field.RichEditorField
                    label="Contact Details"
                    tooltip="Phone, email, or other contact information"
                  />
                )}
              </form.AppField>
              <form.AppField name="isAvailable">
                {(field) => (
                  <field.BoolField
                    label="Is Available"
                    tooltip="Whether worker is currently available for assignments"
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateMaintenanceWorkerFormOption = formOptions({
  defaultValues: {} as Create<'maintenance_workers'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('maintenance_workers')
        .create(value);

      toast.success('Maintenance worker created successfully', {
        description: `A maintenance worker with ID ${response.id} has been created.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 400) {
          toast.error('Validation error: Please check your input fields.');
          formApi.setErrorMap({ onSubmit: { fields: error.data.data } });
        }
      }
    }
  },
});

export const UpdateMaintenanceWorkerFormOption = formOptions({
  defaultValues: {} as Update<'maintenance_workers'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('maintenance_workers')
        .update(meta.id, value);

      toast.success('Maintenance worker updated successfully', {
        description: `A maintenance worker with ID ${response.id} has been updated.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 400) {
          toast.error('Validation error: Please check your input fields.');
          formApi.setErrorMap({ onSubmit: { fields: error.data.data } });
        }
      }
    }
  },
});
