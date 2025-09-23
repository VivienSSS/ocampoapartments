import { useSuspenseQueries } from '@tanstack/react-query';
import type z from 'zod';
import { withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';
import {
  insertTenanciesSchema,
  updateTenanciesSchema,
} from '@/pocketbase/schemas/tenancies';
import { Collections } from '@/pocketbase/types';

export const CreateTenancyForm = withForm({
  defaultValues: {} as z.infer<typeof insertTenanciesSchema>,
  validators: {
    onChange: insertTenanciesSchema,
  },
  props: {} as {
    tenants: TenantsResponse[];
    apartmentUnits: ApartmentUnitsResponse[];
  },
  render: ({ form, tenants, apartmentUnits }) => {
    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={tenants.map((value) => ({
                label: value.facebookName,
                value: value.id,
              }))}
              placeholder="Tenant"
            />
          )}
        </form.AppField>
        <form.AppField name="unit">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={apartmentUnits.map((value) => ({
                label: value.unitLetter,
                value: value.id,
              }))}
              placeholder="Unit"
            />
          )}
        </form.AppField>
        <form.AppField name="leaseStartDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              label="Lease Start Date"
            />
          )}
        </form.AppField>
        <form.AppField name="leaseEndDate">
          {(field) => (
            <field.DateField className="col-span-full" label="Lease End Date" />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditTenancyForm = withForm({
  defaultValues: {} as z.infer<typeof updateTenanciesSchema>,
  validators: {
    onChange: updateTenanciesSchema,
  },
  props: {} as {
    tenants: TenantsResponse[];
    apartmentUnits: ApartmentUnitsResponse[];
  },
  render: ({ form, tenants, apartmentUnits }) => {
    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={tenants.map((value) => ({
                label: value.facebookName,
                value: value.id,
              }))}
              placeholder="Tenant"
            />
          )}
        </form.AppField>
        <form.AppField name="unit">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={apartmentUnits.map((value) => ({
                label: value.unitLetter,
                value: value.id,
              }))}
              placeholder="Unit"
            />
          )}
        </form.AppField>
        <form.AppField name="leaseStartDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              label="Lease Start Date"
            />
          )}
        </form.AppField>
        <form.AppField name="leaseEndDate">
          {(field) => (
            <field.DateField className="col-span-full" label="Lease End Date" />
          )}
        </form.AppField>
      </>
    );
  },
});
