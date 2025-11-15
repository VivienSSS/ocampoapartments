import { useEffect, useState } from 'react';
import type z from 'zod';
import { withForm } from '@/components/ui/forms';
import { pb } from '@/pocketbase';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';
import type { TenanciesResponse } from '@/pocketbase/queries/tenancies';
import {
  type insertMaintenanceRequestSchema,
  updateMaintenanceRequestSchema,
} from '@/pocketbase/schemas/maintenanceRequests';
import type { MaintenanceWorkersResponse } from '@/pocketbase/types';
import {
  Collections,
  MaintenanceRequestsStatusOptions,
  MaintenanceRequestsUrgencyOptions,
  UsersRoleOptions,
} from '@/pocketbase/types';
import { useRouteContext } from '@tanstack/react-router';

export const CreateMaintenanceForm = withForm({
  defaultValues: {
    status: 'Pending',
    submittedDate: new Date(),
  } as z.infer<typeof insertMaintenanceRequestSchema>,
  // validators: {
  //   onChange: insertMaintenanceRequestSchema,
  // },
  render: ({ form }) => {
    const userRole = pb.authStore.record?.role;
    const isTenant = userRole === UsersRoleOptions.Tenant;
    const { pocketbase } = useRouteContext({
      from: '/dashboard/maintenances/',
    });
    const [tenantUnits, setTenantUnits] = useState<string[]>([]);
    const [currentTenant, setCurrentTenant] = useState<string>('');

    // Fetch current tenant's units if user is a tenant
    useEffect(() => {
      if (isTenant && pb.authStore.record?.id) {
        const fetchTenantData = async () => {
          try {
            // Get the current tenant record
            const tenants = await pb
              .collection(Collections.Tenants)
              .getFullList<TenantsResponse>({
                filter: `user = '${pb.authStore.record?.id}'`,
              });

            if (tenants.length > 0) {
              const tenantId = tenants[0].id;
              setCurrentTenant(tenantId);

              // Get all tenancies for this tenant
              const tenancies = await pb
                .collection(Collections.Tenancies)
                .getFullList<TenanciesResponse>({
                  filter: `tenant = '${tenantId}'`,
                });

              // Extract unit IDs
              const unitIds = tenancies.map((t) => t.unit);
              setTenantUnits(unitIds);
            }
          } catch (error) {
            console.error('Failed to fetch tenant data:', error);
          }
        };

        fetchTenantData();
      }
    }, [isTenant]);

    // Set tenant field value if user is a tenant
    useEffect(() => {
      if (isTenant && currentTenant && !form.state.values.tenant) {
        form.setFieldValue('tenant', currentTenant);
      }
    }, [isTenant, currentTenant, form]);

    return (
      <>
        {!isTenant && (
          <form.AppField name="tenant">
            {(field) => (
              <field.RelationField<TenantsResponse>
                label="Tenant"
                tooltip="Select the tenant requesting maintenance"
                description="The tenant who is requesting the maintenance"
                pocketbase={pocketbase}
                relationshipName="tenant"
                collectionName={Collections.Tenants}
                recordListOption={{ expand: 'user', filter: (query) => `${query ? `${query} ~ user.firstName &&` : ``} user.firstName != null` }}
                renderOption={(item) =>
                  `${item.expand.user.firstName} ${item.expand.user.lastName}`
                }
              />
            )}
          </form.AppField>
        )}
        <form.AppField name="unit">
          {(field) => (
            <field.RelationField<ApartmentUnitsResponse>
              label="Unit"
              tooltip="Select the apartment unit needing maintenance"
              description="The apartment unit that requires maintenance"
              pocketbase={pocketbase}
              relationshipName="unit"
              collectionName={Collections.ApartmentUnits}
              recordListOption={{
                expand: 'property',
                filter:
                  isTenant && tenantUnits.length > 0
                    ? tenantUnits.map((id) => `id = '${id}'`).join(' || ')
                    : undefined,
              }}
              renderOption={(item) =>
                `${item.expand.property.branch} - ${item.floorNumber} - ${item.unitLetter}`
              }
            />
          )}
        </form.AppField>
        <form.AppField name="urgency">
          {(field) => (
            <field.SelectField
              label="Urgency"
              tooltip="Select the urgency level of the maintenance request"
              description="How urgent is the maintenance request"
              options={Object.keys(MaintenanceRequestsUrgencyOptions).map(
                (value) => ({ label: value, value: value }),
              )}
            />
          )}
        </form.AppField>
        {!isTenant && (
          <form.AppField name="worker">
            {(field) => (
              <field.RelationField<MaintenanceWorkersResponse>
                label="Assigned Worker"
                tooltip="Select the maintenance worker assigned to this request"
                description="The maintenance worker assigned to handle this request"
                pocketbase={pocketbase}
                relationshipName="worker"
                collectionName={Collections.MaintenanceWorkers}
                recordListOption={{ filter: (query) => `${query ? `${query} ~ name &&` : ``} name != null` }}
                renderOption={(item) => item.name}
              />
            )}
          </form.AppField>
        )}
        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              placeholder="ex. We have a broken faucet. . ."
            />
          )}
        </form.AppField>
        <form.AppField name="submittedDate">
          {(field) => (
            <field.DateTimeField
              label="Submitted Date"
              placeholder="Submitted Date"
            />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditMaintenanceForm = withForm({
  defaultValues: {} as z.infer<typeof updateMaintenanceRequestSchema>,
  validators: {
    onSubmit: updateMaintenanceRequestSchema,
  },
  render: ({ form }) => (
    <div className="space-y-4">
      <form.AppField name="status">
        {(field) => (
          <field.SelectField
            options={Object.keys(MaintenanceRequestsStatusOptions).map(
              (value) => ({ label: value, value: value }),
            )}
            label="Status"
          />
        )}
      </form.AppField>
      <form.AppField name="worker">
        {(field) => (
          <field.RelationField<MaintenanceWorkersResponse>
            pocketbase={pb}
            relationshipName="worker"
            collectionName={Collections.MaintenanceWorkers}
            recordListOption={{ filter: (query) => `${query ? `${query} ~ name &&` : ``} name != null` }}
            renderOption={(item) => item.name}
            label="Worker"
          />
        )}
      </form.AppField>
      <form.AppField name="completedDate">
        {(field) => (
          <field.DateTimeField
            label="Completed Date"
            placeholder="Completed Date"
          />
        )}
      </form.AppField>
    </div>
  ),
});
