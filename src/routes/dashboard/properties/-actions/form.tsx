import { formOptions } from '@tanstack/react-form';
import type z from 'zod';
import { withForm } from '@/components/ui/form';
import {
  insertPropertySchema,
  updatePropertySchema,
} from '@/pocketbase/schemas/properties';
import { PropertiesBranchOptions } from '@/pocketbase/types';

export const CreatePropertyFormOption = formOptions({
  defaultValues: {} as z.infer<typeof insertPropertySchema>,
  validators: {
    onChange: insertPropertySchema,
  },
});

export const UpdatePropertyFormOption = formOptions({
  defaultValues: {} as z.infer<typeof updatePropertySchema>,
  validators: {
    onChange: updatePropertySchema,
  },
});

export const CreatePropertyForm = withForm({
  defaultValues: {} as z.infer<typeof insertPropertySchema>,
  render: ({ form }) => (
    <>
      <form.AppField name="branch">
        {(field) => (
          <field.SelectField
            options={Object.keys(PropertiesBranchOptions).map((key) => ({
              label: key,
              value: key,
            }))}
            className="col-span-full space-y-2"
            label="Branch"
          />
        )}
      </form.AppField>
      <form.AppField name="address">
        {(field) => (
          <field.TextAreaField
            className="col-span-full space-y-2"
            label="Address"
          />
        )}
      </form.AppField>
    </>
  ),
});

export const EditPropertyForm = withForm({
  defaultValues: {} as z.infer<typeof updatePropertySchema>,
  render: ({ form }) => (
    <>
      <form.AppField name="branch">
        {(field) => (
          <field.SelectField
            options={Object.keys(PropertiesBranchOptions).map((key) => ({
              label: key,
              value: key,
            }))}
            className="col-span-full space-y-2"
            label="Branch"
          />
        )}
      </form.AppField>

      <form.AppField name="address">
        {(field) => (
          <field.TextAreaField
            className="col-span-full space-y-2"
            label="Address"
          />
        )}
      </form.AppField>
    </>
  ),
});
