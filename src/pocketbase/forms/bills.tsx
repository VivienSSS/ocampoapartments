import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const BillForm = () =>
  withForm({
    defaultValues: {} as Update<'bills'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="invoiceNumber">
                {(field) => (
                  <field.TextField
                    label="Invoice Number"
                    description="Unique identifier for tracking this bill"
                    placeholder="e.g. INV-001"
                    tooltip="E.g. 'INV-001' or 'INV-2024-001'"
                  />
                )}
              </form.AppField>
              <form.AppField name="tenancy">
                {(field) => (
                  <field.RelationField
                    label="Tenancy"
                    description="The tenant or lease this bill is associated with"
                    relationshipName="tenancy"
                    collection={Collections.Tenancies}
                    placeholder="Select Tenancy"
                    tooltip="E.g. 'John Doe - Unit A'"
                    renderOption={(item) => String(item.id)}
                  />
                )}
              </form.AppField>
              <form.AppField name="dueDate">
                {(field) => (
                  <field.DateTimeField
                    label="Due Date"
                    description="The deadline for payment of this bill"
                    placeholder="Select Due Date"
                    tooltip="E.g. 'April 30, 2024'"
                  />
                )}
              </form.AppField>
              <form.AppField name="status">
                {(field) => (
                  <field.SelectField
                    label="Status"
                    description="Current payment status of the bill"
                    placeholder="Select Status"
                    tooltip="E.g. 'Paid' or 'Overdue'"
                    options={[
                      { label: 'Paid', value: 'Paid' },
                      { label: 'Due', value: 'Due' },
                      { label: 'Overdue', value: 'Overdue' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="hasSent">
                {(field) => (
                  <field.BoolField
                    label="Has Sent"
                    description="Whether the bill has been sent to the tenant"
                    tooltip="Check if sent"
                  />
                )}
              </form.AppField>
              <form.AppField name="items">
                {(field) => (
                  <field.RelationField
                    label="Items"
                    description="Line items and charges included in this bill"
                    relationshipName="items"
                    collection={Collections.BillItems}
                    placeholder="Select Items"
                    tooltip="E.g. 'Rent, Water, Electricity'"
                    renderOption={(item) => String(item.chargeType || item.id)}
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateBillFormOption = formOptions({
  defaultValues: {} as Create<'bills'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase.collection('bills').create(value);

      toast.success('Bill created successfully', {
        description: `A bill with ID ${response.id} has been created.`,
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

export const UpdateBillFormOption = formOptions({
  defaultValues: {} as Update<'bills'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('bills')
        .update(meta.id, value);

      toast.success('Bill updated successfully', {
        description: `A bill with ID ${response.id} has been updated.`,
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
