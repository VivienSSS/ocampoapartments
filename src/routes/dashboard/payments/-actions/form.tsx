import { useSuspenseQueries } from "@tanstack/react-query";
import type z from "zod";
import { withForm } from "@/components/ui/form";
import { pb } from "@/pocketbase";
import {
  insertPaymentSchema,
  updatePaymentSchema,
} from "@/pocketbase/schemas/payments";
import { Collections, PaymentsPaymentMethodOptions } from "@/pocketbase/types";

export const CreatePaymentForm = withForm({
  defaultValues: {} as z.infer<typeof insertPaymentSchema>,
  validators: {
    onChange: insertPaymentSchema,
  },
  render: ({ form }) => {
    const [tenants, bills] = useSuspenseQueries({
      queries: [
        {
          queryKey: ["tenants"],
          queryFn: () => pb.collection(Collections.Tenants).getFullList(),
        },
        {
          queryKey: ["bills"],
          queryFn: () => pb.collection(Collections.Bills).getFullList(),
        },
      ],
    });

    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={tenants.data.map((value) => ({
                label: value.facebookName || value.id,
                value: value.id,
              }))}
              placeholder="Tenant"
            />
          )}
        </form.AppField>
        <form.AppField name="bill">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={bills.data.map((value) => ({
                label: value.id,
                value: value.id,
              }))}
              placeholder="Bill"
            />
          )}
        </form.AppField>
        <form.AppField name="paymentMethod">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={Object.keys(PaymentsPaymentMethodOptions).map(
                (value) => ({ label: value, value: value }),
              )}
              placeholder="Payment Method"
            />
          )}
        </form.AppField>
        <form.AppField name="amountPaid">
          {(field) => (
            <field.TextField
              className="col-span-full"
              placeholder="Amount Paid"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="paymentDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              placeholder="Payment Date"
            />
          )}
        </form.AppField>
        <form.AppField name="transactionId">
          {(field) => (
            <field.TextField
              className="col-span-full"
              placeholder="Transaction ID"
            />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditPaymentForm = withForm({
  defaultValues: {} as z.infer<typeof updatePaymentSchema>,
  validators: {
    onChange: updatePaymentSchema,
  },
  render: ({ form }) => {
    const [tenants, bills] = useSuspenseQueries({
      queries: [
        {
          queryKey: ["tenants"],
          queryFn: () => pb.collection(Collections.Tenants).getFullList(),
        },
        {
          queryKey: ["bills"],
          queryFn: () => pb.collection(Collections.Bills).getFullList(),
        },
      ],
    });

    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={tenants.data.map((value) => ({
                label: value.facebookName || value.id,
                value: value.id,
              }))}
              placeholder="Tenant"
            />
          )}
        </form.AppField>
        <form.AppField name="bill">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={bills.data.map((value) => ({
                label: value.id,
                value: value.id,
              }))}
              placeholder="Bill"
            />
          )}
        </form.AppField>
        <form.AppField name="paymentMethod">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={Object.keys(PaymentsPaymentMethodOptions).map(
                (value) => ({ label: value, value: value }),
              )}
              placeholder="Payment Method"
            />
          )}
        </form.AppField>
        <form.AppField name="amountPaid">
          {(field) => (
            <field.TextField
              className="col-span-full"
              placeholder="Amount Paid"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="paymentDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              placeholder="Payment Date"
            />
          )}
        </form.AppField>
        <form.AppField name="transactionId">
          {(field) => (
            <field.TextField
              className="col-span-full"
              placeholder="Transaction ID"
            />
          )}
        </form.AppField>
      </>
    );
  },
});
