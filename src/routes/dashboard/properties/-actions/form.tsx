import { formOptions } from '@tanstack/react-form';
import type z from 'zod';
import { withForm } from '@/components/ui/forms';
import {
  insertPropertySchema,
  updatePropertySchema,
} from '@/pocketbase/schemas/properties';
import { PropertiesBranchOptions } from '@/pocketbase/types';

export const CreatePropertyFormOption = formOptions({
  defaultValues: {} as z.infer<typeof insertPropertySchema>,
  validators: {
    onSubmit: insertPropertySchema,
  },
});

export const UpdatePropertyFormOption = formOptions({
  defaultValues: {} as z.infer<typeof updatePropertySchema>,
  validators: {
    onSubmit: updatePropertySchema,
  },
});

export const CreatePropertyForm = withForm({
  defaultValues: {} as z.infer<typeof insertPropertySchema>,
  render: ({ form }) => (
    <>
      <form.AppField name="branch">
        {(field) => (
          <field.SelectField
            tooltip="Select the branch for the property"
            description="The branch where the property is located"
            options={Object.keys(PropertiesBranchOptions).map((key) => ({
              label: key,
              value: key,
            }))}
            label="Branch"
          />
        )}
      </form.AppField>
      <form.AppField name="address">
        {(field) => (
          <field.TextareaField
            tooltip="Enter the full address of the property"
            description="The complete address including street, city, and zip code"
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
            tooltip="Select the branch for the property"
            description="The branch where the property is located"
            options={Object.keys(PropertiesBranchOptions).map((key) => ({
              label: key,
              value: key,
            }))}
            label="Branch"
          />
        )}
      </form.AppField>

      <form.AppField name="address">
        {(field) => (
          <field.TextareaField
            tooltip="Enter the full address of the property"
            description="The complete address including street, city, and zip code"
            className="col-span-full space-y-2"
            label="Address"
          />
        )}
      </form.AppField>
    </>
  ),
});
