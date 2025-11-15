import { BadgePlus, Trash } from 'lucide-react';
import type z from 'zod';
import { AsyncSelect } from '@/components/ui/async-select';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { withFieldGroup, withForm } from '@/components/ui/forms';
import { pb } from '@/pocketbase';
import type { TenanciesResponse } from '@/pocketbase/queries/tenancies';
import type { insertBillItemsSchema } from '@/pocketbase/schemas/billItems';
import { insertBillSchema, updateBillSchema } from '@/pocketbase/schemas/bills';
import {
  BillItemsChargeTypeOptions,
  BillsStatusOptions,
  Collections,
} from '@/pocketbase/types';
import { useRouteContext } from '@tanstack/react-router';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';

export const CreateBillingForm = withForm({
  defaultValues: {
    items: [{}],
  } as z.infer<typeof insertBillSchema>,
  validators: {
    onSubmit: insertBillSchema,
  },
  render: ({ form }) => {
    const { pocketbase } = useRouteContext({ from: '/dashboard/billing/' });

    return (
      <>
        <FieldSet>
          <FieldLegend>Bill information</FieldLegend>
          <FieldDescription>
            Select the tenancy and set the bill details
          </FieldDescription>
          <FieldGroup>
            <form.AppField name="tenancy">
              {(field) => (
                <field.RelationField<TenanciesResponse>
                  pocketbase={pocketbase}
                  collectionName={Collections.Tenancies}
                  relationshipName="tenancy"
                  renderOption={(item) =>
                    `${item?.expand?.tenant?.expand.user?.firstName} ${item?.expand?.tenant?.expand.user?.lastName} - ${item?.expand?.tenant?.expand.user.contactEmail}`
                  }
                  recordListOption={{ expand: 'tenant.user' }}
                />
              )}
            </form.AppField>
            <form.AppField name="status">
              {(field) => (
                <field.SelectField
                  options={Object.keys(BillsStatusOptions)
                    .filter((value) => value !== 'Paid')
                    .map((value) => ({
                      label: value,
                      value: value,
                    }))}
                  label="Status"
                />
              )}
            </form.AppField>
            <form.AppField name="dueDate">
              {(field) => (
                <field.DateTimeField
                  label="Due Date"
                  showTime
                  showCalendarIcon
                />
              )}
            </form.AppField>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator>Bill Items</FieldSeparator>
        <FieldSet>
          <FieldLegend>Items to be charged</FieldLegend>
          <FieldDescription>Add items to the bill</FieldDescription>
          <FieldGroup>
            <form.AppField name="items" mode="array">
              {(field) => (
                <>
                  <Button
                    type="button"
                    className="mb-4 col-span-full"
                    onClick={() =>
                      field.pushValue({
                        chargeType: BillItemsChargeTypeOptions.Electricity,
                        description: '',
                        amount: undefined,
                      })
                    }
                  >
                    <BadgePlus /> Add Item
                  </Button>
                  <Accordion
                    type="single"
                    className="col-span-full"
                    collapsible
                  >
                    {field.state.value?.map((item, index) => (
                      <CreateBillingItemForm
                        key={`${item.description}-${item.amount}-${index}`}
                        form={form}
                        fields={`items[${index}]`}
                        onDelete={() => field.removeValue(index)}
                      />
                    ))}
                  </Accordion>
                </>
              )}
            </form.AppField>
          </FieldGroup>
        </FieldSet>
      </>
    );
  },
});

export const CreateBillingItemForm = withFieldGroup({
  defaultValues: {} as z.infer<typeof insertBillItemsSchema>,
  props: { onDelete: () => { } },
  render: ({ group, onDelete }) => {
    return (
      <AccordionItem
        value={`item-${group.state.values.amount}`}
        className="border rounded-md p-4 first:rounded-b-none last:rounded-t-none"
      >
        <AccordionTrigger>
          <Button onClick={onDelete} variant={'outline'} size={'icon'}>
            <Trash />
          </Button>
        </AccordionTrigger>
        <AccordionContent className="grid grid-cols-1 gap-5">
          <group.AppField name="chargeType">
            {(field) => (
              <field.SelectField
                label="Charge Type"
                options={Object.keys(BillItemsChargeTypeOptions).map((o) => ({
                  label: o,
                  value: o,
                }))}
              />
            )}
          </group.AppField>
          <group.AppField name="amount">
            {(field) => <field.NumberField label="Amount" />}
          </group.AppField>
          <group.AppField name="description">
            {(field) => <field.TextareaField label="Description" />}
          </group.AppField>
        </AccordionContent>
      </AccordionItem>
    );
  },
});

export const EditBillingForm = withForm({
  defaultValues: {} as z.infer<typeof updateBillSchema>,
  validators: {
    onChange: updateBillSchema,
  },
  render: ({ form }) => (
    <>
      <form.AppField name="status">
        {(field) => (
          <field.SelectField
            options={Object.keys(BillsStatusOptions).map((value) => ({
              label: value,
              value: value,
            }))}
            placeholder="Status"
          />
        )}
      </form.AppField>
    </>
  ),
});
