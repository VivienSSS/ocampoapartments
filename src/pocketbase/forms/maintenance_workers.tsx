import { withForm } from '@/components/ui/forms';
import type { Update } from '../types';

export const MaintenanceWorkerForm = () =>
  withForm({
    defaultValues: {} as Update<'maintenance_workers'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
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
        </form.AppForm>
      );
    },
  });
