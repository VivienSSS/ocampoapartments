import { useSuspenseQuery } from '@tanstack/react-query';
import type z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { withFieldGroup, withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import type { insertBillItemsSchema } from '@/pocketbase/schemas/billItems';
import { insertBillSchema, updateBillSchema } from '@/pocketbase/schemas/bills';
import {
  BillItemsChargeTypeOptions,
  BillsStatusOptions,
  Collections,
} from '@/pocketbase/types';

export const CreateBillingForm = withForm({
  defaultValues: {
    items: [{}],
  } as z.infer<typeof insertBillSchema>,
  validators: {
    onChange: insertBillSchema,
  },
  render: ({ form }) => {
    const { data: tenancies } = useSuspenseQuery({
      queryKey: ['properties'],
      queryFn: () => pb.collection(Collections.Tenancies).getFullList(),
    });

    return (
      <>
        <form.AppField name="tenancy">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={tenancies.map((value) => ({
                label: value.tenant,
                value: value.id,
              }))}
              label="Tenancies"
              placeholder="id"
            />
          )}
        </form.AppField>
        <form.AppField name="dueDate">
          {(field) => (
            <field.DateField className="col-span-full" label="Due Date" />
          )}
        </form.AppField>
        <form.AppField name="items" mode="array">
          {(field) => (
            <>
              {field.state.value?.map((item, index) => (
                <CreateBillingItemForm
                  key={`${item.description}-${item.amount}`}
                  form={form}
                  fields={`items[${index}]`}
                />
              ))}
              <Button
                onClick={() =>
                  field.pushValue({
                    chargeType: BillItemsChargeTypeOptions.Electricity,
                    description: '',
                    amount: undefined,
                  })
                }
              >
                Add Item
              </Button>
            </>
          )}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={Object.keys(BillsStatusOptions).map((value) => ({
                label: value,
                value: value,
              }))}
              placeholder="Status"
            />
          )}
        </form.AppField>
      </>
    );
  },
});

export const CreateBillingItemForm = withFieldGroup({
  defaultValues: {} as z.infer<typeof insertBillItemsSchema>,
  render: ({ group }) => {
    return (
      <Card className="col-span-full">
        <CardContent className="grid grid-cols-1 gap-5">
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
            {(field) => <field.TextField label="Amount" />}
          </group.AppField>
          <group.AppField name="description">
            {(field) => <field.TextAreaField label="Description" />}
          </group.AppField>
        </CardContent>
      </Card>
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
      <form.AppField name="tenancy">
        {(field) => <field.TextField />}
      </form.AppField>
      <form.AppField name="dueDate">
        {(field) => <field.TextField />}
      </form.AppField>
      <form.AppField name="status">
        {(field) => <field.TextField />}
      </form.AppField>
    </>
  ),
});
