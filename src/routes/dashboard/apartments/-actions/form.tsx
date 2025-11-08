import { formOptions } from '@tanstack/react-form';
import { useSuspenseQuery } from '@tanstack/react-query';
import type z from 'zod';
import { withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import type {
  insertApartmentUnitSchema,
  updateApartmentUnitSchema,
} from '@/pocketbase/schemas/apartmentUnits';
import { Collections, type PropertiesResponse } from '@/pocketbase/types';

export const CreateApartmentUnitFormOption = formOptions({
  defaultValues: {} as z.infer<typeof insertApartmentUnitSchema>,
});

export const UpdateApartmentUnitFormOption = formOptions({
  defaultValues: {} as z.infer<typeof updateApartmentUnitSchema>,
});

export const CreateApartmentForm = withForm({
  ...CreateApartmentUnitFormOption,
  props: {} as { properties: PropertiesResponse[] },
  render: ({ form, properties }) => {
    return (
      <>
        <form.AppField name="floorNumber">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Floor Number"
              placeholder="ex. 1"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="capacity">
          {(field) => (
            <field.TextField
              className="col-span-2"
              label="Capacity"
              placeholder="ex. 2"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="price">
          {(field) => (
            <field.TextField
              className="col-span-2"
              label="Price"
              placeholder="ex. 5000"
              type="number"
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
            <field.SelectField
              className="col-span-full"
              options={properties.map((value) => ({
                label: value.address,
                value: value.id,
              }))}
              label="Property"
            />
          )}
        </form.AppField>
        <form.AppField name="isAvailable">
          {(field) => (
            <field.CheckBoxField className="col-span-full" label="Available" />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditApartmentForm = withForm({
  ...UpdateApartmentUnitFormOption,
  props: {} as { properties: PropertiesResponse[] },
  render: ({ form, properties }) => (
    <div className="grid gap-6 grid-cols-4">
      <form.AppField name="floorNumber">
        {(field) => (
          <field.TextField
            className="col-span-full"
            label="Floor Number"
            placeholder="ex. 1"
            type="number"
          />
        )}
      </form.AppField>
      <form.AppField name="capacity">
        {(field) => (
          <field.TextField
            className="col-span-2"
            label="Capacity"
            placeholder="ex. 2"
            type="number"
          />
        )}
      </form.AppField>
      <form.AppField name="price">
        {(field) => (
          <field.TextField
            className="col-span-2"
            label="Price"
            placeholder="ex. 5000"
            type="number"
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
          <field.SelectField
            className="col-span-full"
            options={properties.map((value) => ({
              label: value.address,
              value: value.id,
            }))}
            label="Property"
          />
        )}
      </form.AppField>
      <form.AppField name="isAvailable">
        {(field) => (
          <field.CheckBoxField
            className="col-span-full mt-2"
            label="Available"
          />
        )}
      </form.AppField>
    </div>
  ),
});
