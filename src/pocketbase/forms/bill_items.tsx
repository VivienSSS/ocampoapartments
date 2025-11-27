import { withFieldGroup } from '@/components/ui/forms';
import type { Update } from '../types';

export const BillItemFieldGroup = () =>
  withFieldGroup({
    defaultValues: {} as Update<'bill_items'>,
    render: ({ group }) => {
      return (
        <group.AppForm>
          <group.AppField name="chargeType">
            {(field) => (
              <field.SelectField
                label="Charge Type"
                placeholder="Select Charge Type"
                tooltip="Type of charge (e.g., Rent, Utilities, Maintenance)"
                options={[
                  { label: 'Rent', value: 'rent' },
                  { label: 'Utilities', value: 'utilities' },
                  { label: 'Maintenance', value: 'maintenance' },
                ]}
              />
            )}
          </group.AppField>
          <group.AppField name="amount">
            {(field) => (
              <field.NumberField
                label="Amount"
                placeholder="Enter Amount"
                tooltip="Amount charged for this item"
              />
            )}
          </group.AppField>
          <group.AppField name="description">
            {(field) => (
              <field.RichEditorField
                label="Description"
                tooltip="Details about this charge"
              />
            )}
          </group.AppField>
        </group.AppForm>
      );
    },
  });
