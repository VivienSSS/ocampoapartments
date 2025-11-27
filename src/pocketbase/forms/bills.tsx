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
