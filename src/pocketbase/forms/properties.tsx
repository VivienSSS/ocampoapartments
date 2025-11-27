import { withForm } from '@/components/ui/forms';
import type { Update } from '../types';

export const PropertyForm = () =>
  withForm({
    defaultValues: {} as Update<'properties'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <form.AppField name="branch">
            {(field) => (
              <field.SelectField
                label="Branch"
                placeholder="Select Branch"
                tooltip="Property location/branch"
                options={[
                  { label: 'Main', value: 'main' },
                  { label: 'Branch A', value: 'branch_a' },
                  { label: 'Branch B', value: 'branch_b' },
                ]}
              />
            )}
          </form.AppField>
          <form.AppField name="address">
            {(field) => (
              <field.TextField
                label="Address"
                placeholder="Enter Address"
                tooltip="Full property address"
              />
            )}
          </form.AppField>
        </form.AppForm>
      );
    },
  });
