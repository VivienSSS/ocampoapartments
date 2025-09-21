import { useSuspenseQueries } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import type z from 'zod';
import { withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import {
  insertTenantSchema,
  updateTenantSchema,
} from '@/pocketbase/schemas/tenants';
import { Collections } from '@/pocketbase/types';

export const CreateTenantForm = withForm({
  defaultValues: {} as z.infer<typeof insertTenantSchema>,
  validators: {
    onChange: insertTenantSchema,
  },
  render: ({ form }) => {
    const [users] = useSuspenseQueries({
      queries: [
        {
          queryKey: ['users'],
          queryFn: () => pb.collection(Collections.Users).getFullList(),
        },
      ],
    });

    return (
      <>
        <form.AppField name="user">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={users.data.map((value) => ({
                label: value.username,
                value: value.id,
              }))}
              label="User's Email"
            />
          )}
        </form.AppField>
        <form.AppField name="firstName">
          {(field) => (
            <field.TextField className="col-span-full" label="First Name" />
          )}
        </form.AppField>
        <form.AppField name="lastName">
          {(field) => (
            <field.TextField className="col-span-full" label="Last Name" />
          )}
        </form.AppField>
        <form.AppField name="phoneNumber">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Phone Number"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="email">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Email"
              type="email"
            />
          )}
        </form.AppField>
        <form.AppField name="facebookName">
          {(field) => (
            <field.TextField className="col-span-full" label="FaceBook Name" />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditApartmentForm = withForm({
  defaultValues: {} as z.infer<typeof updateTenantSchema>,
  validators: {
    onChange: updateTenantSchema,
  },
  render: ({ form }) => (
    <>
      <form.AppField name="user">
        {(field) => <field.TextField label="User's Email" />}
      </form.AppField>
      <form.AppField name="firstName">
        {(field) => (
          <field.TextField className="col-span-full" label="First Name" />
        )}
      </form.AppField>
      <form.AppField name="lastName">
        {(field) => (
          <field.TextField className="col-span-full" label="Last Name" />
        )}
      </form.AppField>
      <form.AppField name="phoneNumber">
        {(field) => (
          <field.TextField
            className="col-span-full"
            label="Phone Number"
            type="number"
          />
        )}
      </form.AppField>
      <form.AppField name="email">
        {(field) => (
          <field.TextField
            className="col-span-full"
            label="Email"
            type="email"
          />
        )}
      </form.AppField>
      <form.AppField name="facebookName">
        {(field) => (
          <field.TextField className="col-span-full" label="FaceBook Name" />
        )}
      </form.AppField>
    </>
  ),
});
