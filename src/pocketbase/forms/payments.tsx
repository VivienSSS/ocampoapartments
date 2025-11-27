import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const PaymentForm = () =>
  withForm({
    defaultValues: {} as Update<'payments'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="bill">
                {(field) => (
                  <field.RelationField
                    relationshipName="bill"
                    collection={Collections.Bills}
                    placeholder="Select Bill"
                    renderOption={(item) =>
                      String(item.invoiceNumber || item.id)
                    }
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
                    options={[{ label: 'GCash', value: 'GCash' }]}
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
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreatePaymentFormOption = formOptions({
  defaultValues: {} as Create<'payments'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('payments')
        .create(value);

      toast.success('Payment created successfully', {
        description: `A payment with ID ${response.id} has been created.`,
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

export const UpdatePaymentFormOption = formOptions({
  defaultValues: {} as Update<'payments'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('payments')
        .update(meta.id, value);

      toast.success('Payment updated successfully', {
        description: `A payment with ID ${response.id} has been updated.`,
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
