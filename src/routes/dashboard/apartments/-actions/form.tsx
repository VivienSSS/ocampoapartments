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
              label="Floor number"
              placeholder="ex. 3"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="capacity">
          {(field) => (
            <field.TextField
              className="col-span-2"
              label="capacity"
              placeholder="ex. 8"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="price">
          {(field) => (
            <field.TextField
              className="col-span-2"
              label="Price"
              placeholder="ex. 500"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="unitLetter">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Unit letter"
              placeholder="A"
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
              placeholder="id"
            />
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
    <>
      <form.AppField name="floorNumber">
        {(field) => (
          <field.TextField
            className="col-span-full"
            label="Floor number"
            placeholder="ex. 3"
            type="number"
          />
        )}
      </form.AppField>
      <form.AppField name="capacity">
        {(field) => (
          <field.TextField
            className="col-span-2"
            label="capacity"
            placeholder="ex. 8"
            type="number"
          />
        )}
      </form.AppField>
      <form.AppField name="price">
        {(field) => (
          <field.TextField
            className="col-span-2"
            label="Price"
            placeholder="ex. 500"
            type="number"
          />
        )}
      </form.AppField>
      <form.AppField name="unitLetter">
        {(field) => (
          <field.TextField
            className="col-span-full"
            label="Unit letter"
            placeholder="A"
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
            placeholder="id"
          />
        )}
      </form.AppField>
    </>
  ),
});
