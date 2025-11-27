import { withForm } from '@/components/ui/forms';
import { Collections, type Update } from '../types';

export const BillForm = () =>
  withForm({
    defaultValues: {} as Update<'bills'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <form.AppField name="invoiceNumber">
            {(field) => (
              <field.TextField
                label="Invoice Number"
                placeholder="e.g. INV-001"
                tooltip="Unique invoice identifier"
              />
            )}
          </form.AppField>
          <form.AppField name="tenancy">
            {(field) => (
              <field.RelationField
                relationshipName="tenancy"
                collection={Collections.Tenancies}
                placeholder="Select Tenancy"
                renderOption={(item) => String(item.id)}
              />
            )}
          </form.AppField>
          <form.AppField name="dueDate">
            {(field) => (
              <field.DateTimeField
                label="Due Date"
                placeholder="Select Due Date"
                tooltip="When payment is due"
              />
            )}
          </form.AppField>
          <form.AppField name="status">
            {(field) => (
              <field.SelectField
                label="Status"
                placeholder="Select Status"
                tooltip="Current bill status"
                options={[
                  { label: 'Pending', value: 'pending' },
                  { label: 'Paid', value: 'paid' },
                  { label: 'Overdue', value: 'overdue' },
                ]}
              />
            )}
          </form.AppField>
          <form.AppField name="hasSent">
            {(field) => (
              <field.BoolField
                label="Has Sent"
                tooltip="Whether bill has been sent to tenant"
              />
            )}
          </form.AppField>
          <form.AppField name="items">
            {(field) => (
              <field.RelationField
                relationshipName="items"
                collection={Collections.BillItems}
                placeholder="Select Items"
                renderOption={(item) => String(item.chargeType || item.id)}
              />
            )}
          </form.AppField>
        </form.AppForm>
      );
    },
  });
