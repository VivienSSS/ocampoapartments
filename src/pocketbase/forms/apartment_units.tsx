import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const ApartmentUnitForm = () =>
  withForm({
    defaultValues: {} as Update<'apartment_units'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="property">
                {(field) => (
                  <field.RelationField
                    relationshipName="property"
                    collection={Collections.Properties}
                    placeholder="Select Property"
                    renderOption={(item) =>
                      String(item.branch || item.address || item.id)
                    }
                  />
                )}
              </form.AppField>
              <form.AppField name="unitLetter">
                {(field) => (
                  <field.TextField
                    label="Unit Letter"
                    placeholder="e.g. A, B, C"
                    tooltip="Unit identifier letter"
                  />
                )}
              </form.AppField>
              <form.AppField name="price">
                {(field) => (
                  <field.NumberField
                    label="Price"
                    placeholder="Enter Monthly Rent"
                    tooltip="Monthly rent price"
                  />
                )}
              </form.AppField>
              <form.AppField name="capacity">
                {(field) => (
                  <field.NumberField
                    label="Capacity"
                    placeholder="Number of Occupants"
                    tooltip="Maximum number of occupants"
                  />
                )}
              </form.AppField>
              <form.AppField name="floorNumber">
                {(field) => (
                  <field.NumberField
                    label="Floor Number"
                    placeholder="Enter Floor Number"
                    tooltip="Which floor the unit is on"
                  />
                )}
              </form.AppField>
              <form.AppField name="isAvailable">
                {(field) => (
                  <field.BoolField
                    label="Is Available"
                    tooltip="Whether this unit is available for rent"
                  />
                )}
              </form.AppField>
              <form.AppField name="image">
                {(field) => <field.FileField placeholder="Upload Unit Image" />}
              </form.AppField>
              <form.AppField name="carouselImage">
                {(field) => (
                  <field.FileField placeholder="Upload Carousel Image" />
                )}
              </form.AppField>
              <form.AppField name="roomSize">
                {(field) => (
                  <field.NumberField
                    label="Room Size"
                    placeholder="Enter Room Size (sqm)"
                    tooltip="Room size in square meters"
                  />
                )}
              </form.AppField>
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateApartmentUnitFormOption = formOptions({
  defaultValues: {} as Create<'apartment_units'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('apartment_units')
        .create(value);

      toast.success('Apartment unit created successfully', {
        description: `An apartment unit with ID ${response.id} has been created.`,
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

export const UpdateApartmentUnitFormOption = formOptions({
  defaultValues: {} as Update<'apartment_units'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('apartment_units')
        .update(meta.id, value);

      toast.success('Apartment unit updated successfully', {
        description: `An apartment unit with ID ${response.id} has been updated.`,
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
