import type z from 'zod';
import { withForm } from '@/components/ui/form';
import {
  insertPropertySchema,
  updatePropertySchema,
} from '@/pocketbase/schemas/properties';
import { PropertiesBranchOptions } from '@/pocketbase/types';

export const CreatePropertyForm = withForm({
  defaultValues: {} as z.infer<typeof insertPropertySchema>,
  validators: {
    onChange: insertPropertySchema,
  },
  render: ({ form }) => (
    <>
      <form.AppField name="address">
        {(field) => (
          <field.TextAreaField
            className="col-span-full"
            placeholder="Your address"
          />
        )}
      </form.AppField>
      <form.AppField name="branch">
        {(field) => (
          <field.SelectField
            options={Object.keys(PropertiesBranchOptions).map((key) => ({
              label: key,
              value: key,
            }))}
            className="col-span-full"
            placeholder="Branch Type"
          />
        )}
      </form.AppField>
    </>
  ),
});

export const EditPropertyForm = withForm({
  defaultValues: {} as z.infer<typeof updatePropertySchema>,
  validators: {
    onChange: updatePropertySchema,
  },
  render: ({ form }) => (
    <>
      <form.AppField name="address">
        {(field) => <field.TextAreaField />}
      </form.AppField>
      <form.AppField name="branch">
        {(field) => <field.TextField />}
      </form.AppField>
    </>
  ),
});
