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
                description="The category or type of charge being billed"
                placeholder="Select Charge Type"
                tooltip="E.g. 'Rent' or 'Water'"
                options={[
                  { label: 'Rent', value: 'Rent' },
                  { label: 'Water', value: 'Water' },
                ]}
              />
            )}
          </group.AppField>
          <group.AppField name="amount">
            {(field) => (
              <field.NumberField
                label="Amount"
                description="The monetary amount for this charge"
                placeholder="Enter Amount"
                tooltip="E.g. '5000'"
              />
            )}
          </group.AppField>
          <group.AppField name="description">
            {(field) => (
              <field.RichEditorField
                label="Description"
                description="Additional details and notes about this charge item"
                tooltip="E.g. 'April water consumption'"
              />
            )}
          </group.AppField>
        </group.AppForm>
      );
    },
  });
