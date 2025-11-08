import { format } from 'date-fns';
import type z from 'zod';
import { withForm } from '@/components/ui/forms';
import type { BillsResponse } from '@/pocketbase/queries/bills';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';
import { insertPaymentSchema } from '@/pocketbase/schemas/payments';
import { Collections, PaymentsPaymentMethodOptions } from '@/pocketbase/types';
import { useRouteContext } from '@tanstack/react-router';

export const CreatePaymentForm = withForm({
  defaultValues: {} as z.infer<typeof insertPaymentSchema>,
  validators: {
    onSubmit: insertPaymentSchema,
  },
  render: ({ form }) => {
    const { pocketbase } = useRouteContext({
      from: '/dashboard/payments/',
    });

    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <field.RelationField<TenantsResponse>
              label="Tenant"
              tooltip="Select the tenant making the payment"
              description="The tenant who is making the payment"
              pocketbase={pocketbase}
              relationshipName="tenant"
              collectionName={Collections.Tenants}
              recordListOption={{ expand: 'user' }}
              renderOption={(item) =>
                `${item.expand.user.firstName} ${item.expand.user.lastName}`
              }
            />
          )}
        </form.AppField>
        <form.AppField name="bill">
          {(field) => (
            <field.RelationField<BillsResponse>
              label="Bill"
              tooltip="Select the bill being paid"
              description="The bill that is being paid"
              pocketbase={pocketbase}
              relationshipName="bill"
              recordListOption={{ expand: 'tenancy.tenant.user' }}
              collectionName={Collections.Bills}
              renderOption={(item) => {
                const date = format(new Date(item.dueDate), 'PPP');
                const firstName =
                  item.expand?.tenancy?.expand?.tenant?.expand?.user
                    ?.firstName || '';
                const lastName =
                  item.expand?.tenancy?.expand?.tenant?.expand?.user
                    ?.lastName || '';
                const fullName = `${firstName} ${lastName}`.trim();
                return `${date} - ${fullName}`;
              }}
            />
          )}
        </form.AppField>
        <form.AppField name="paymentMethod">
          {(field) => (
            <field.SelectField
              label="Payment Method"
              tooltip="Select the payment method"
              description="The method used to make the payment"
              options={Object.keys(PaymentsPaymentMethodOptions).map(
                (value) => ({ label: value, value: value }),
              )}
            />
          )}
        </form.AppField>
        <form.AppField name="amountPaid">
          {(field) => (
            <field.NumberField
              tooltip="Enter the amount paid"
              description="The total amount paid by the tenant"
              className="col-span-full"
              label="Amount Paid"
            />
          )}
        </form.AppField>
        <form.AppField name="paymentDate">
          {(field) => <field.DateTimeField label="Payment Date" showTime />}
        </form.AppField>
        <form.AppField name="transactionId">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Transaction ID and Proof of Payment"
              tooltip="Enter the transaction ID from the payment and upload proof of payment"
              description="The transaction ID provided after making the payment"
              placeholder="ex. 12345678910"
            />
          )}
        </form.AppField>
        <form.AppField name="screenshot">
          {(field) => (
            <field.FileField
              label="Proof of Payment"
              tooltip="Upload a screenshot of the payment proof"
              description="The screenshot of the payment proof"
            />
          )}
        </form.AppField>
      </>
    );
  },
});
