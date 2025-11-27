import { withForm } from '@/components/ui/forms';
import {
  BillsStatusOptions,
  type CollectionResponses,
  type Create,
  type TenanciesResponse,
  type TenantsResponse,
  type TypedPocketBase,
  type Update,
} from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSeparator, FieldSet } from '@/components/ui/field';
import { BillItemFieldGroup } from './bill_items';
import { Button } from '@/components/ui/button';

export const BillForm = () =>
  withForm({
    defaultValues: {} as Update<'bills'> & { items: Update<'bill_items'>[] },
    props: {} as { action?: 'create' | 'update' },
    render: ({ form, action }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              {action === 'create' && (
                <>
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
                      <field.RelationField<
                        TenanciesResponse<{
                          tenant: TenantsResponse<{
                            user: CollectionResponses['users'];
                          }>;
                          unit: CollectionResponses['apartment_units'];
                        }>
                      >
                        label="Tenancy"
                        description="The tenant or lease this bill is associated with"
                        relationshipName="tenancy"
                        collection={Collections.Tenancies}
                        placeholder="Select Tenancy"
                        tooltip="E.g. 'John Doe - Unit A'"
                        recordListOption={{ expand: 'tenant.user,unit' }}
                        renderOption={(item) =>
                          String(
                            `${item.expand?.tenant?.expand?.user?.email || item.expand?.tenant?.facebookName || 'Tenant'} - Unit ${item.expand?.unit?.unitLetter || 'N/A'} (Floor ${item.expand?.unit?.floorNumber || 'N/A'})`,
                          )
                        }
                      />
                    )}
                  </form.AppField>
                </>
              )}
              <form.AppField name="dueDate">
                {(field) => (
                  <field.DateTimeField
                    disablePastDates
                    label="Due Date"
                    description="The deadline for payment of this bill"
                    placeholder="Select Due Date"
                    tooltip="E.g. 'April 30, 2024'"
                  />
                )}
              </form.AppField>
              <form.AppField
                name="status"
                defaultValue={BillsStatusOptions.Draft}
              >
                {(field) => (
                  <field.SelectField
                    label="Status"
                    description="Current payment status of the bill"
                    placeholder="Select Status"
                    tooltip="E.g. 'Paid' or 'Overdue'"
                    options={[
                      { label: 'Draft', value: BillsStatusOptions.Draft },
                      { label: 'Paid', value: BillsStatusOptions.Paid },
                      { label: 'Due', value: BillsStatusOptions.Due },
                    ]}
                  />
                )}
              </form.AppField>
              {action === 'create' && (
                <>
                  <FieldSeparator />
                  <form.AppField name="items" mode="array">
                    {(field) => (
                      <>
                        {field.state.value?.map((item, index) => (
                          <BillItemFieldGroup
                            key={item}
                            form={form}
                            fields={`items[${index}]`}
                            onRemove={() => {
                              field.removeValue(index);
                            }}
                            index={index}
                          />
                        ))}
                        <Button
                          type="button"
                          className="mb-4"
                          onClick={() => {
                            field.pushValue(undefined as any);
                          }}
                        >
                          Add Item
                        </Button>
                      </>
                    )}
                  </form.AppField>
                </>
              )}
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateBillFormOption = formOptions({
  defaultValues: {
    status: BillsStatusOptions.Draft,
  } as Omit<Create<'bills'>, 'items'> & {
    items?: Create<'bill_items'>[];
  },
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    let billId: string | null = null;

    try {
      const { items, ...billData } = value;

      const batch = meta.pocketbase.createBatch();

      for (const item of items || []) {
        batch.collection(Collections.BillItems).create({
          ...item,
        });
      }

      const result = await batch.send();

      const billResponse = await meta.pocketbase.collection('bills').create({
        ...billData,
        items: items ? result.map((res) => res.body.id) : [],
      });

      billId = billResponse.id;

      toast.success('Bill created successfully', {
        description: `A bill with ID ${billResponse.id} has been created.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        // rollback
        if (billId) {
          await meta.pocketbase.collection('bills').delete(billId);
        }

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
