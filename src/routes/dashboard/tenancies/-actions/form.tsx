import z from 'zod';
import { AsyncSelect } from '@/components/ui/async-select';
import { withForm } from '@/components/ui/forms';
import { pb } from '@/pocketbase';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';
import {
  insertTenanciesSchema,
  updateTenanciesSchema,
} from '@/pocketbase/schemas/tenancies';
import { Collections } from '@/pocketbase/types';
import { useRouteContext } from '@tanstack/react-router';

export enum LeaseContract {
  HalfYear = '6 Months',
  FullYear = '1 Year',
}

export const CreateTenancyForm = withForm({
  defaultValues: {} as Omit<
    z.infer<typeof insertTenanciesSchema>,
    'leaseStartDate' | 'leaseEndDate'
  > & { leaseContract: LeaseContract },
  validators: {
    onSubmit: insertTenanciesSchema.extend({
      leaseContract: z.enum(LeaseContract),
    }),
  },
  render: ({ form }) => {
    const { pocketbase } = useRouteContext({
      from: '/dashboard/tenancies/',
    });

    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <field.RelationField<TenantsResponse>
              label="Tenant"
              tooltip="Select the tenant for the tenancy"
              description="The tenant who will be renting the unit"
              pocketbase={pocketbase}
              collectionName={Collections.Tenants}
              recordListOption={{ expand: 'user' }}
              renderOption={(item) =>
                `${item.expand.user.firstName} ${item.expand.user.lastName}`
              }
              relationshipName="tenant"
            />
          )}
        </form.AppField>
        <form.AppField name="unit">
          {(field) => (
            <field.RelationField<ApartmentUnitsResponse>
              label="Unit"
              tooltip="Select the apartment unit for the tenancy"
              description="The apartment unit that will be rented"
              pocketbase={pocketbase}
              collectionName={Collections.ApartmentUnits}
              relationshipName="unit"
              recordListOption={{ expand: 'property' }}
              renderOption={(item) =>
                `${item.expand.property.address} - ${item.unitLetter} - ${item.floorNumber}`
              }
            />
          )}
        </form.AppField>
        <form.AppField name="leaseContract">
          {(field) => (
            <field.SelectField
              tooltip="Select the lease contract duration"
              description="The duration of the lease contract"
              options={Object.values(LeaseContract).map((obj) => ({
                label: obj,
                value: obj,
              }))}
              label="Lease Contract"
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
    onSubmit: updateTenanciesSchema,
  },
  props: {} as {
    tenants: TenantsResponse[];
    apartmentUnits: ApartmentUnitsResponse[];
  },
  render: ({ form }) => {
    const { pocketbase } = useRouteContext({
      from: '/dashboard/tenancies/',
    });

    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <field.RelationField<TenantsResponse>
              label="Tenant"
              tooltip="Select the tenant for the tenancy"
              description="The tenant who will be renting the unit"
              pocketbase={pocketbase}
              relationshipName="tenant"
              collectionName={Collections.Tenants}
              recordListOption={{ expand: 'user' }}
              renderOption={(item) =>
                `${item.expand.user.firstName} ${item.expand.user.lastName}`
              }
            />
          )}
        </form.AppField>
        <form.AppField name="unit">
          {(field) => (
            <field.RelationField<ApartmentUnitsResponse>
              label="Unit"
              tooltip="Select the apartment unit for the tenancy"
              description="The apartment unit that will be rented"
              pocketbase={pocketbase}
              collectionName={Collections.ApartmentUnits}
              relationshipName="unit"
              recordListOption={{ expand: 'property' }}
              renderOption={(item) =>
                `${item.expand.property.address} - ${item.unitLetter} - ${item.floorNumber}`
              }
            />
          )}
        </form.AppField>
        <form.AppField name="leaseStartDate">
          {(field) => (
            <field.DateTimeField
              label="Lease Start Date"
              tooltip="Select the lease start date"
              description="The date when the lease starts"
            />
          )}
        </form.AppField>
        <form.AppField name="leaseEndDate">
          {(field) => (
            <field.DateTimeField
              label="Lease End Date"
              tooltip="Select the lease end date"
              description="The date when the lease ends"
            />
          )}
        </form.AppField>
      </>
    );
  },
});
