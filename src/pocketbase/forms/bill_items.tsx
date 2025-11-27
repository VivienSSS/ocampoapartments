import { withFieldGroup } from '@/components/ui/forms';
import type { Update } from '../types';
import {
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

export const BillItemFieldGroup = withFieldGroup({
  defaultValues: {} as Update<'bill_items'>,
  props: {} as { index: number; onRemove?: () => void },
  render: ({ group, onRemove, index }) => {
    return (
      <group.AppForm>
        <FieldSet>
          <FieldLegend className="flex justify-between w-full items-center">
            Bill Item # {index + 1}
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onRemove}
            >
              <Trash />
            </Button>
          </FieldLegend>
          <FieldGroup>
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
                <field.TextareaField
                  label="Description"
                  description="Additional details and notes about this charge item"
                  tooltip="E.g. 'April water consumption'"
                />
              )}
            </group.AppField>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
      </group.AppForm>
    );
  },
});
