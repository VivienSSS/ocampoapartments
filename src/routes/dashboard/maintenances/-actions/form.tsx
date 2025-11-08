import type z from 'zod';
import { AsyncSelect } from '@/components/ui/async-select';
import { withForm } from '@/components/ui/forms';
import { pb } from '@/pocketbase';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';
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
                recordListOption={{ expand: 'user' }}
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
              recordListOption={{ expand: 'property' }}
              renderOption={(item) =>
                `${item.expand.property.address} - ${item.unitLetter} - ${item.floorNumber}`
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
        <form.AppField name="worker">
          {(field) => (
            <field.RelationField<MaintenanceWorkersResponse>
              label="Assigned Worker"
              tooltip="Select the maintenance worker assigned to this request"
              description="The maintenance worker assigned to handle this request"
              pocketbase={pocketbase}
              relationshipName="worker"
              collectionName={Collections.MaintenanceWorkers}
              renderOption={(item) => item.name}
            />
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextareaField
              label="Description"
              placeholder="ex. We have a broken faucet. . ."
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
