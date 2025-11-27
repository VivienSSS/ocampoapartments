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
                    label="Property"
                    description="The property building where this unit is located"
                    relationshipName="property"
                    collection={Collections.Properties}
                    placeholder="Select Property"
                    tooltip="E.g. 'Quezon City Branch'"
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
                    description="The letter designation for this apartment unit"
                    placeholder="e.g. A, B, C"
                    tooltip="E.g. 'A' or 'B'"
                  />
                )}
              </form.AppField>
              <form.AppField name="price">
                {(field) => (
                  <field.NumberField
                    label="Price"
                    description="Monthly rental price for the unit"
                    placeholder="Enter Monthly Rent"
                    tooltip="E.g. '5000'"
                  />
                )}
              </form.AppField>
              <form.AppField name="capacity">
                {(field) => (
                  <field.NumberField
                    label="Capacity"
                    description="Maximum number of people allowed to occupy this unit"
                    placeholder="Number of Occupants"
                    tooltip="E.g. '4'"
                  />
                )}
              </form.AppField>
              <form.AppField name="floorNumber">
                {(field) => (
                  <field.NumberField
                    label="Floor Number"
                    description="The floor level where this unit is located"
                    placeholder="Enter Floor Number"
                    tooltip="E.g. '1' or '3'"
                  />
                )}
              </form.AppField>
              <form.AppField name="isAvailable">
                {(field) => (
                  <field.BoolField
                    label="Is Available"
                    description="Marks whether this unit is currently available for rent"
                    tooltip="Check if available"
                  />
                )}
              </form.AppField>
              <form.AppField name="image">
                {(field) => (
                  <field.FileField
                    label="Unit Image"
                    description="Upload a main image for the apartment unit"
                    placeholder="Upload Unit Image"
                    tooltip="E.g. 'living_room.jpg'"
                  />
                )}
              </form.AppField>
              <form.AppField name="carouselImage">
                {(field) => (
                  <field.FileField
                    multiple
                    label="Carousel Images"
                    description="Upload multiple images for the unit carousel"
                    placeholder="Upload Carousel Image"
                    tooltip="E.g. 'bedroom1.jpg, kitchen.jpg'"
                  />
                )}
              </form.AppField>
              <form.AppField name="roomSize">
                {(field) => (
                  <field.NumberField
                    label="Room Size"
                    description="The total area of the unit in square meters"
                    placeholder="Enter Room Size (sqm)"
                    tooltip="E.g. '50' for 50 sqm"
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
