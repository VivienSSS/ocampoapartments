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
import { AsyncSelect } from '@/components/ui/async-select';

export enum LeaseContract {
  HalfYear = '6 Months',
  FullYear = '1 Year',
}

export const CreateTenancyForm = withForm({
  defaultValues: {} as Omit<z.infer<typeof insertTenanciesSchema>, 'leaseStartDate' | 'leaseEndDate'> & { leaseContract: LeaseContract },
  props: {} as {
    tenants: TenantsResponse[];
    apartmentUnits: ApartmentUnitsResponse[];
  },
  render: ({ form, tenants, apartmentUnits }) => {
    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <div className="col-span-full">
              <AsyncSelect<TenantsResponse>
                className='w-full'
                fetcher={async (query) => (await pb.collection(Collections.Tenants).getList<TenantsResponse>(1, 10, { filter: `user.firstName ~ '%${query}%'`, expand: 'user', requestKey: null })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => `${option.expand.user.firstName} ${option.expand.user.lastName}`}
                renderOption={(option) => <div>{`${option.expand.user.firstName} ${option.expand.user.lastName}`}</div>}
                value={field.state.value}
                onChange={field.handleChange}
                label="Tenants"
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="unit">
          {(field) => (
            <div className="col-span-full">
              <AsyncSelect<ApartmentUnitsResponse>
                className='w-full'
                fetcher={async (query) => (await pb.collection(Collections.ApartmentUnits).getList<ApartmentUnitsResponse>(1, 10, { filter: `floorNumber ~ '%${query}%' || unitLetter ~ '%${query}%' || property.branch ~ '%${query}%'`, expand: 'property', requestKey: null })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => `Unit ${option.unitLetter} - Floor ${option.floorNumber} - ${option.expand.property.branch}`}
                renderOption={(option) => <div>{`Unit ${option.unitLetter} - Floor ${option.floorNumber} - ${option.expand.property.branch}`}</div>}
                value={field.state.value}
                onChange={field.handleChange}
                label="Records"
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="leaseContract">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={Object.values(LeaseContract).map((obj) => ({ label: obj, value: obj }))}
              placeholder="Lease Contract"
            />
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
