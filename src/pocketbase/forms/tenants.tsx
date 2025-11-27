import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const TenantForm = () =>
  withForm({
    defaultValues: {} as Update<'tenants'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="user">
                {(field) => (
                  <field.RelationField
                    label="User"
                    description="The user account associated with this tenant"
                    relationshipName="user"
                    collection={Collections.Users}
                    placeholder="Select User"
                    tooltip="E.g. 'John Doe' or 'johndoe@email.com'"
                    recordListOption={{ expand: '' }}
                    renderOption={(item) =>
                      String(item.name || item.email || item.id)
                    }
                  />
                )}
              </form.AppField>
              <form.AppField name="phoneNumber">
                {(field) => (
                  <field.NumberField
                    label="Phone Number"
                    description="The tenant's primary contact phone number"
                    placeholder="Enter Phone Number"
                    tooltip="E.g. '639123456789'"
                  />
                )}
              </form.AppField>
              <form.AppField name="facebookName">
                {(field) => (
                  <field.TextField
                    label="Facebook Name"
                    description="The tenant's Facebook account name for alternative contact"
                    placeholder="Enter Facebook Name"
                    tooltip="E.g. 'john.doe.123' or 'John Doe'"
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateTenantFormOption = formOptions({
  defaultValues: {} as Create<'tenants'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('tenants')
        .create(value);

      toast.success('Tenant created successfully', {
        description: `A tenant with ID ${response.id} has been created.`,
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

export const UpdateTenantFormOption = formOptions({
  defaultValues: {} as Update<'tenants'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('tenants')
        .update(meta.id, value);

      toast.success('Tenant updated successfully', {
        description: `A tenant with ID ${response.id} has been updated.`,
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
