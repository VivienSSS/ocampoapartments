import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const PropertyForm = () =>
  withForm({
    defaultValues: {} as Update<'properties'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="branch">
                {(field) => (
                  <field.SelectField
                    label="Branch"
                    description="The property location or branch name"
                    placeholder="Select Branch"
                    tooltip="E.g. 'Quezon City' or 'Pampanga'"
                    options={[
                      { label: 'Quezon City', value: 'Quezon City' },
                      { label: 'Pampanga', value: 'Pampanga' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="address">
                {(field) => (
                  <field.TextareaField
                    label="Address"
                    description="The complete physical address of the property"
                    placeholder="Enter Address"
                    tooltip="E.g. '123 Main Street, Barangay North, Quezon City, Metro Manila'"
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreatePropertyFormOption = formOptions({
  defaultValues: {} as Create<'properties'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('properties')
        .create(value);

      toast.success('Property created successfully', {
        description: `A property with ID ${response.id} has been created.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 400) {
          toast.error('Validation error: Please check your input fields.');
          formApi.setErrorMap({ onSubmit: { fields: error.data.data } });
        }
      }
    }
  },
});

export const UpdatePropertyFormOption = formOptions({
  defaultValues: {} as Update<'properties'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('properties')
        .update(meta.id, value);

      toast.success('Property updated successfully', {
        description: `A property with ID ${response.id} has been updated.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 400) {
          toast.error('Validation error: Please check your input fields.');
          formApi.setErrorMap({ onSubmit: { fields: error.data.data } });
        }
      }
    }
  },
});
