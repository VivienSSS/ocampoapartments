import { withForm } from '@/components/ui/forms';
import { Collections, type Update } from '../types';

export const ApartmentUnitForm = () =>
  withForm({
    defaultValues: {} as Update<'apartment_units'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
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
            {(field) => <field.FileField placeholder="Upload Carousel Image" />}
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
        </form.AppForm>
      );
    },
  });
