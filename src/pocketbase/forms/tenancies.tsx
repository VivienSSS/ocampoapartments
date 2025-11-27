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
                    label="Tenant"
                    description="The tenant entering into this lease agreement"
                    relationshipName="tenant"
                    collection={Collections.Tenants}
                    placeholder="Select Tenant"
                    tooltip="E.g. 'John Doe'"
                    renderOption={(item) =>
                      String(item.phoneNumber || item.user || item.id)
                    }
                  />
                )}
              </form.AppField>
              <form.AppField name="unit">
                {(field) => (
                  <field.RelationField
                    label="Unit"
                    description="The apartment unit being leased"
                    relationshipName="unit"
                    collection={Collections.ApartmentUnits}
                    placeholder="Select Unit"
                    tooltip="E.g. 'Unit A - Floor 1'"
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
                    description="The date when the lease agreement begins"
                    placeholder="Select Start Date"
                    tooltip="E.g. 'May 1, 2024'"
                  />
                )}
              </form.AppField>
              <form.AppField name="leaseEndDate">
                {(field) => (
                  <field.DateTimeField
                    label="Lease End Date"
                    description="The date when the lease agreement expires"
                    placeholder="Select End Date"
                    tooltip="E.g. 'April 30, 2025'"
                  />
                )}
              </form.AppField>
              <form.AppField name="contractDocument">
                {(field) => (
                  <field.FileField
                    label="Contract Document"
                    description="Upload the signed lease agreement or contract document"
                    placeholder="Upload Lease Contract"
                    tooltip="E.g. 'lease_agreement.pdf'"
                  />
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
