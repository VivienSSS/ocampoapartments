import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const TenancyForm = () =>
  withForm({
    defaultValues: {} as Update<'tenancies'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="tenant">
                {(field) => (
                  <field.RelationField
                    relationshipName="tenant"
                    collection={Collections.Tenants}
                    placeholder="Select Tenant"
                    renderOption={(item) =>
                      String(item.phoneNumber || item.user || item.id)
                    }
                  />
                )}
              </form.AppField>
              <form.AppField name="unit">
                {(field) => (
                  <field.RelationField
                    relationshipName="unit"
                    collection={Collections.ApartmentUnits}
                    placeholder="Select Unit"
                    renderOption={(item) =>
                      String(`${item.unitLetter} - Floor ${item.floorNumber}`)
                    }
                  />
                )}
              </form.AppField>
              <form.AppField name="leaseStartDate">
                {(field) => (
                  <field.DateTimeField
                    label="Lease Start Date"
                    placeholder="Select Start Date"
                    tooltip="When the lease begins"
                  />
                )}
              </form.AppField>
              <form.AppField name="leaseEndDate">
                {(field) => (
                  <field.DateTimeField
                    label="Lease End Date"
                    placeholder="Select End Date"
                    tooltip="When the lease ends"
                  />
                )}
              </form.AppField>
              <form.AppField name="hasSent">
                {(field) => (
                  <field.BoolField
                    label="Has Sent"
                    tooltip="Whether lease document has been sent"
                  />
                )}
              </form.AppField>
              <form.AppField name="contractDocument">
                {(field) => (
                  <field.FileField placeholder="Upload Lease Contract" />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateTenancyFormOption = formOptions({
  defaultValues: {} as Create<'tenancies'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('tenancies')
        .create(value);

      toast.success('Tenancy created successfully', {
        description: `A tenancy with ID ${response.id} has been created.`,
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

export const UpdateTenancyFormOption = formOptions({
  defaultValues: {} as Update<'tenancies'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('tenancies')
        .update(meta.id, value);

      toast.success('Tenancy updated successfully', {
        description: `A tenancy with ID ${response.id} has been updated.`,
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
