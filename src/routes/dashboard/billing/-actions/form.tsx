import { useSuspenseQuery } from '@tanstack/react-query';
import type z from 'zod';
import { withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import { insertBillSchema, updateBillSchema } from '@/pocketbase/schemas/bills';
import { BillsStatusOptions, Collections } from '@/pocketbase/types';

export const CreateBillingForm = withForm({
  defaultValues: {} as z.infer<typeof insertBillSchema>,
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
