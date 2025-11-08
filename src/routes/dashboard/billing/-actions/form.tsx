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
import { withFieldGroup, withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import type { TenanciesResponse } from '@/pocketbase/queries/tenancies';
import type { insertBillItemsSchema } from '@/pocketbase/schemas/billItems';
import {
  type insertBillSchema,
  updateBillSchema,
} from '@/pocketbase/schemas/bills';
import {
  BillItemsChargeTypeOptions,
  BillsStatusOptions,
  Collections,
} from '@/pocketbase/types';

export const CreateBillingForm = withForm({
  defaultValues: {
    items: [{}],
  } as z.infer<typeof insertBillSchema>,
  // validators: {
  //   onChange: insertBillSchema,
  // },
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="tenancy">
          {(field) => (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tenant
              </label>
              <AsyncSelect<TenanciesResponse>
                className="w-full"
                fetcher={async (query) =>
                  (
                    await pb
                      .collection(Collections.Tenancies)
                      .getList<TenanciesResponse>(1, 10, {
                        filter: query
                          ? `tenant.user.firstName ~ '%${query}%' || tenant.user.lastName ~ '%${query}%'`
                          : '',
                        expand: 'tenant.user,unit.property',
                        requestKey: null,
                      })
                  ).items
                }
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) =>
                  `${option.expand.tenant.expand.user.firstName} ${option.expand.tenant.expand.user.lastName}`
                }
                renderOption={(option) => (
                  <div>
                    <div className="font-medium">{`${option.expand.tenant.expand.user.firstName} ${option.expand.tenant.expand.user.lastName}`}</div>
                    <div className="text-sm text-muted-foreground">
                      Unit {option.expand.unit.unitLetter} -{' '}
                      {option.expand.unit.expand.property.branch}
                    </div>
                  </div>
                )}
                value={field.state.value || ''}
                onChange={field.handleChange}
                label="Tenancies"
                placeholder="Search tenants..."
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.SelectField
              className="col-span-full"
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
            <field.DateField className="col-span-full" label="Due Date" />
          )}
        </form.AppField>

        <label className="block text-lg font-medium text-foreground mb-2">
          Bill Items
        </label>
        <form.AppField name="items" mode="array">
          {(field) => (
            <>
              <Button
                type="button"
                className="bg-emerald-500 mb-4 col-span-full"
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
              {field.state.value?.map((item, index) => (
                <CreateBillingItemForm
                  key={`${item.description}-${item.amount}-${index}`}
                  form={form}
                  fields={`items[${index}]`}
                  onDelete={() => field.removeValue(index)}
                />
              ))}
            </>
          )}
        </form.AppField>
      </>
    );
  },
});

export const CreateBillingItemForm = withFieldGroup({
  defaultValues: {} as z.infer<typeof insertBillItemsSchema>,
  props: { onDelete: () => {} },
  render: ({ group, onDelete }) => {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardAction onClick={onDelete}>
            <Button variant={'outline'} size={'icon'}>
              <Trash />
            </Button>
          </CardAction>
        </CardHeader>
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
  ),
});
