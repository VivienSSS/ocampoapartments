import type z from "zod";
import { withForm } from "@/components/ui/form";
import {
  insertTenantSchema,
  updateTenantSchema,
} from "@/pocketbase/schemas/tenants";
import type { UsersRecord } from "@/pocketbase/types";

export const CreateTenantForm = withForm({
  defaultValues: {} as z.infer<typeof insertTenantSchema>,
  validators: {
    onChange: insertTenantSchema,
  },
  props: {} as { users: UsersRecord[] },
  render: ({ form, users }) => {
    return (
      <>
        <form.AppField name="user">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={users.map((value) => ({
                label: value.contactEmail,
                value: value.id,
              }))}
              label="User's Email"
            />
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

  props: {} as { users: UsersRecord[] },
  render: ({ form, users }) => (
    <>
      <form.AppField name="user">
        {(field) => (
          <field.SelectField
            className="col-span-full"
            options={users.map((value) => ({
              label: value.contactEmail,
              value: value.id,
            }))}
            label="User's Email"
          />
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
      <form.AppField name="facebookName">
        {(field) => (
          <field.TextField className="col-span-full" label="FaceBook Name" />
        )}
      </form.AppField>
    </>
  ),
});
