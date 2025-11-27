import { withForm } from '@/components/ui/forms';
import { Collections, type Update } from '../types';

export const PaymentForm = () =>
  withForm({
    defaultValues: {} as Update<'payments'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <form.AppField name="bill">
            {(field) => (
              <field.RelationField
                relationshipName="bill"
                collection={Collections.Bills}
                placeholder="Select Bill"
                renderOption={(item) => String(item.invoiceNumber || item.id)}
              />
            )}
          </form.AppField>
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
          <form.AppField name="paymentMethod">
            {(field) => (
              <field.SelectField
                label="Payment Method"
                placeholder="Select Payment Method"
                tooltip="How the payment was made"
                options={[
                  { label: 'Cash', value: 'cash' },
                  { label: 'Bank Transfer', value: 'bank_transfer' },
                  { label: 'Check', value: 'check' },
                ]}
              />
            )}
          </form.AppField>
          <form.AppField name="amountPaid">
            {(field) => (
              <field.NumberField
                label="Amount Paid"
                placeholder="Enter Amount"
                tooltip="Amount of payment"
              />
            )}
          </form.AppField>
          <form.AppField name="paymentDate">
            {(field) => (
              <field.DateTimeField
                label="Payment Date"
                placeholder="Select Payment Date"
                tooltip="When payment was made"
              />
            )}
          </form.AppField>
          <form.AppField name="transactionId">
            {(field) => (
              <field.TextField
                label="Transaction ID"
                placeholder="Enter Transaction ID"
                tooltip="Reference transaction identifier"
              />
            )}
          </form.AppField>
          <form.AppField name="screenshot">
            {(field) => (
              <field.FileField placeholder="Upload Payment Screenshot" />
            )}
          </form.AppField>
          <form.AppField name="isVerified">
            {(field) => (
              <field.BoolField
                label="Is Verified"
                tooltip="Whether payment has been verified"
              />
            )}
          </form.AppField>
        </form.AppForm>
      );
    },
  });
