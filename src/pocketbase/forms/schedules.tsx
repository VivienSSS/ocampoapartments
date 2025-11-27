import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const ScheduleForm = () =>
  withForm({
    defaultValues: {} as Update<'schedules'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="tenant">
                {(field) => (
                  <field.RelationField
                    relationshipName="tenant"
                    collection={Collections.Tenants}
                    placeholder="Select Tenant"
                    renderOption={(item) =>
                      String(item.phoneNumber || item.user || item.id)
                    }
                  />
                )}
              </form.AppField>
              <form.AppField name="reason">
                {(field) => (
                  <field.SelectField
                    label="Reason"
                    placeholder="Select Reason"
                    tooltip="Reason for the scheduled appointment"
                    options={[
                      { label: 'Visit', value: 'visit' },
                      { label: 'Meeting', value: 'meeting' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="message">
                {(field) => (
                  <field.TextField
                    label="Message"
                    placeholder="Enter Message"
                    tooltip="Additional details about the appointment"
                  />
                )}
              </form.AppField>
              <form.AppField name="date">
                {(field) => (
                  <field.DateTimeField
                    label="Date"
                    placeholder="Select Date and Time"
                    tooltip="When the appointment is scheduled"
                  />
                )}
              </form.AppField>
              <form.AppField name="isApproved">
                {(field) => (
                  <field.BoolField
                    label="Is Approved"
                    tooltip="Whether the appointment has been approved"
                  />
                )}
              </form.AppField>
              <form.AppField name="isCancelled">
                {(field) => (
                  <field.BoolField
                    label="Is Cancelled"
                    tooltip="Whether the appointment has been cancelled"
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateScheduleFormOption = formOptions({
  defaultValues: {} as Create<'schedules'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('schedules')
        .create(value);

      toast.success('Schedule created successfully', {
        description: `A schedule with ID ${response.id} has been created.`,
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

export const UpdateScheduleFormOption = formOptions({
  defaultValues: {} as Update<'schedules'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('schedules')
        .update(meta.id, value);

      toast.success('Schedule updated successfully', {
        description: `A schedule with ID ${response.id} has been updated.`,
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
