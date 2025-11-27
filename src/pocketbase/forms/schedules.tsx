import { withForm } from '@/components/ui/forms';
import { Collections, type Update } from '../types';

export const ScheduleForm = () =>
  withForm({
    defaultValues: {} as Update<'schedules'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
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
        </form.AppForm>
      );
    },
  });
