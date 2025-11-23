import { useEffect, useState, useRef } from 'react';
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
import { getNextStatuses } from '@/pocketbase/utils/maintenanceStatusFlow';
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
    const [tenantHasNoUnits, setTenantHasNoUnits] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

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
                requestKey: null,
              });

            if (tenants.length > 0) {
              const tenantId = tenants[0].id;
              setCurrentTenant(tenantId);

              // Get all tenancies for this tenant
              const tenancies = await pb
                .collection(Collections.Tenancies)
                .getFullList<TenanciesResponse>({
                  filter: `tenant = '${tenantId}'`,
                  requestKey: null,
                });

              // Extract unit IDs
              const unitIds = tenancies.map((t) => t.unit);
              setTenantUnits(unitIds);
              setTenantHasNoUnits(unitIds.length === 0);
            }
          } catch (error) {
            // Silently ignore abort errors
            if ((error as any)?.name !== 'AbortError') {
              console.error('Failed to fetch tenant data:', error);
            }
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

    // Fetch units when tenant is selected (for non-tenant users)
    useEffect(() => {
      const selectedTenant = form.state.values.tenant;

      if (!isTenant && selectedTenant) {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        (async () => {
          try {
            const tenancies = await pb
              .collection(Collections.Tenancies)
              .getFullList<TenanciesResponse>({
                filter: `tenant = '${selectedTenant}'`,
                requestKey: null,
              });

            // Only update state if request wasn't aborted
            if (!signal.aborted) {
              const unitIds = tenancies.map((t) => t.unit);
              setTenantUnits(unitIds);
              setTenantHasNoUnits(unitIds.length === 0);
              form.setFieldValue('unit', '');
            }
          } catch (error) {
            // Silently ignore abort errors
            if ((error as any)?.name !== 'AbortError' && !signal.aborted) {
              console.error('Failed to fetch tenant units:', error);
              setTenantUnits([]);
              setTenantHasNoUnits(true);
            }
          }
        })();
      } else if (!selectedTenant) {
        setTenantUnits([]);
        setTenantHasNoUnits(false);
      }
    }, [form.state.values.tenant, isTenant, form]);

    // Cleanup abort controller on unmount
    useEffect(() => {
      return () => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      };
    }, []);

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
        {tenantHasNoUnits && (form.state.values.tenant || isTenant) && (
          <div className="rounded-md bg-amber-50 p-3 text-sm text-amber-700 border border-amber-200">
            This tenant does not have a unit assigned.
          </div>
        )}
        {(!tenantHasNoUnits && tenantUnits.length > 0) || isTenant ? (
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
                    tenantUnits.length > 0
                      ? tenantUnits.map((id) => `id = '${id}'`).join(' || ')
                      : undefined,
                }}
                renderOption={(item) =>
                  `${item.expand.property.branch} - ${item.floorNumber} - ${item.unitLetter}`
                }
              />
            )}
          </form.AppField>
        ) : null}
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
              disablePastDates={true}
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
  render: ({ form }) => {
    const currentStatus = form.state.values.status as MaintenanceRequestsStatusOptions | undefined;
    const validNextStatuses = getNextStatuses(currentStatus);

    return (
      <div className="space-y-4">
        <form.AppField name="status">
          {(field) => (
            <field.SelectField
              options={validNextStatuses.map(
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
              disablePastDates={true}
            />
          )}
        </form.AppField>
      </div>
    );
  },
});
