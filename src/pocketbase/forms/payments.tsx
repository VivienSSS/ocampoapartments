import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Item, ItemMedia } from '@/components/ui/item';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const PaymentForm = () =>
  withForm({
    defaultValues: {} as Update<'payments'>,
    props: {} as { action?: 'create' | 'update' },
    render: ({ form, action }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              {action === 'create' && (
                <>
                  <form.AppField name="bill">
                    {(field) => (
                      <field.RelationField
                        label="Bill"
                        description="The bill that this payment is for"
                        relationshipName="bill"
                        collection={Collections.Bills}
                        placeholder="Select Bill"
                        tooltip="E.g. 'INV-001'"
                        renderOption={(item) =>
                          String(item.invoiceNumber || item.id)
                        }
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="tenant">
                    {(field) => (
                      <field.RelationField
                        label="Tenant"
                        description="The tenant who made this payment"
                        relationshipName="tenant"
                        collection={Collections.Tenants}
                        placeholder="Select Tenant"
                        tooltip="E.g. 'John Doe'"
                        renderOption={(item) =>
                          String(item.phoneNumber || item.user || item.id)
                        }
                      />
                    )}
                  </form.AppField>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>Show QR</Button>
                    </DialogTrigger>
                    <DialogContent
                      className="max-h-3/4 overflow-y-auto"
                      showCloseButton={false}
                    >
                      <DialogHeader>
                        <DialogTitle>Payment QR Code</DialogTitle>
                        <DialogDescription>
                          Scan this QR code to make a payment via GCash.
                        </DialogDescription>
                      </DialogHeader>
                      <Item className="w-full">
                        <ItemMedia variant="image" className="w-full h-auto">
                          <img
                            src="/image.png"
                            className="w-full h-auto object-cover"
                            alt=""
                          />
                        </ItemMedia>
                      </Item>
                    </DialogContent>
                  </Dialog>
                  <form.AppField name="paymentMethod">
                    {(field) => (
                      <field.SelectField
                        label="Payment Method"
                        description="The method used to make this payment"
                        placeholder="Select Payment Method"
                        tooltip="E.g. 'GCash'"
                        options={[{ label: 'GCash', value: 'GCash' }]}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="amountPaid">
                    {(field) => (
                      <field.NumberField
                        label="Amount Paid"
                        description="The amount of money paid by the tenant"
                        placeholder="Enter Amount"
                        tooltip="E.g. '5000'"
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="paymentDate">
                    {(field) => (
                      <field.DateTimeField
                        disablePastDates
                        label="Payment Date"
                        description="The date and time when the payment was received"
                        placeholder="Select Payment Date"
                        tooltip="E.g. 'April 15, 2024 3:30 PM'"
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="transactionId">
                    {(field) => (
                      <field.TextField
                        label="Transaction ID"
                        description="Reference identifier from the payment provider"
                        placeholder="Enter Transaction ID"
                        tooltip="E.g. 'GCASH-2024-001234'"
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="screenshot">
                    {(field) => (
                      <field.FileField
                        label="Screenshot"
                        description="Upload a screenshot or proof of the payment transaction"
                        placeholder="Upload Payment Screenshot"
                      />
                    )}
                  </form.AppField>
                </>
              )}
              <form.AppField name="isVerified">
                {(field) => (
                  <div className="mb-4">
                    <field.BoolField
                      label="Is Verified"
                      description="Whether the payment has been verified"
                      tooltip="Check if verified"
                    />
                  </div>
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
