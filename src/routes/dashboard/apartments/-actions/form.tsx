import { formOptions } from '@tanstack/react-form';
import type z from 'zod';
import { withForm } from '@/components/ui/forms';
import {
  insertApartmentUnitSchema,
  updateApartmentUnitSchema,
} from '@/pocketbase/schemas/apartmentUnits';
import { Collections, type PropertiesRecord } from '@/pocketbase/types';
import { useRouteContext } from '@tanstack/react-router';

export const CreateApartmentUnitFormOption = formOptions({
  defaultValues: {
    isAvailable: true,
  } as z.infer<typeof insertApartmentUnitSchema>,
  validators: {
    onSubmit: insertApartmentUnitSchema,
  },
});

export const UpdateApartmentUnitFormOption = formOptions({
  defaultValues: {} as z.infer<typeof updateApartmentUnitSchema>,
  validators: {
    onSubmit: updateApartmentUnitSchema,
  },
});

export const CreateApartmentForm = withForm({
  ...CreateApartmentUnitFormOption,
  render: ({ form }) => {
    const { pocketbase } = useRouteContext({ from: '/dashboard/apartments/' });

    return (
      <>
        <form.AppField name="floorNumber">
          {(field) => (
            <field.NumberField
              className="col-span-full"
              label="Floor Number"
              placeholder="ex. 1"
            />
          )}
        </form.AppField>
        <form.AppField name="capacity">
          {(field) => (
            <field.NumberField
              className="col-span-2"
              label="Capacity"
              placeholder="ex. 2"
            />
          )}
        </form.AppField>
        <form.AppField name="price">
          {(field) => (
            <field.NumberField
              showClearButton
              className="col-span-2"
              label="Price"
              placeholder="ex. 5000"
            />
          )}
        </form.AppField>
        <form.AppField name="room_size">
          {(field) => (
            <field.NumberField
              showClearButton
              className="col-span-2"
              label="Room Size (m²)"
              placeholder="ex. 25"
            />
          )}
        </form.AppField>
        <form.AppField name="unitLetter">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Unit Letter"
              placeholder="ex. A"
            />
          )}
        </form.AppField>
        <form.AppField name="property">
          {(field) => (
            <field.RelationField<PropertiesRecord>
              pocketbase={pocketbase}
              collection={Collections.Properties}
              relationshipName="property"
              recordListOption={{
                filter: (query) => `branch ~ '${query}'`,
              }}
              renderOption={(item) => item.branch}
              label="Property"
            />
          )}
        </form.AppField>
        <form.AppField name="isAvailable">
          {(field) => <field.BoolField label="Available" />}
        </form.AppField>
        <form.AppField name="image">
          {(field) => (
            <field.ImageUploadField
              className="col-span-full"
              label="Main Image"
              description="Upload a main image for the unit (recommended size: 1200x800px)"
              tooltip="This is the featured image that will be displayed prominently"
              multiple={false}
            />
          )}
        </form.AppField>
        <form.AppField name="carousel_image">
          {(field) => (
            <field.ImageUploadField
              className="col-span-full"
              label="Carousel Images"
              description="Upload multiple images to create a gallery carousel (supports up to 10 images)"
              tooltip="These images will be shown in the carousel on the unit details page"
              multiple={true}
            />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditApartmentForm = withForm({
  ...UpdateApartmentUnitFormOption,
  render: ({ form }) => {
    const { pocketbase } = useRouteContext({ from: '/dashboard/apartments/' });
    return (
      <>
        <form.AppField name="floorNumber">
          {(field) => (
            <field.NumberField
              className="col-span-full"
              label="Floor Number"
              placeholder="ex. 1"
            />
          )}
        </form.AppField>
        <form.AppField name="capacity">
          {(field) => (
            <field.NumberField
              className="col-span-2"
              label="Capacity"
              placeholder="ex. 2"
            />
          )}
        </form.AppField>
        <form.AppField name="price">
          {(field) => (
            <field.NumberField
              showClearButton
              className="col-span-2"
              label="Price"
              placeholder="ex. 5000"
            />
          )}
        </form.AppField>
        <form.AppField name="room_size">
          {(field) => (
            <field.NumberField
              showClearButton
              className="col-span-2"
              label="Room Size (m²)"
              placeholder="ex. 25"
            />
          )}
        </form.AppField>
        <form.AppField name="unitLetter">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Unit Letter"
              placeholder="ex. A"
            />
          )}
        </form.AppField>
        <form.AppField name="property">
          {(field) => (
            <field.RelationField<PropertiesRecord>
              pocketbase={pocketbase}
              collection={Collections.Properties}
              relationshipName="property"
              recordListOption={{
                filter: (query) => `branch ~ '${query}'`,
              }}
              renderOption={(item) => item.branch}
              label="Property"
            />
          )}
        </form.AppField>
        <form.AppField name="isAvailable">
          {(field) => <field.BoolField label="Available" />}
        </form.AppField>
        <form.AppField name="image">
          {(field) => (
            <field.ImageUploadField
              className="col-span-full"
              label="Main Image"
              description="Upload a main image for the unit (recommended size: 1200x800px)"
              tooltip="This is the featured image that will be displayed prominently"
              multiple={false}
            />
          )}
        </form.AppField>
        <form.AppField name="carousel_image">
          {(field) => (
            <field.ImageUploadField
              className="col-span-full"
              label="Carousel Images"
              description="Upload multiple images to create a gallery carousel (supports up to 10 images)"
              tooltip="These images will be shown in the carousel on the unit details page"
              multiple={true}
            />
          )}
        </form.AppField>
      </>
    );
  },
});
