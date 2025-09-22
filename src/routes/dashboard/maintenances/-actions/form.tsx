import { useSuspenseQueries } from '@tanstack/react-query';
import type z from 'zod';
import { withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import {
  insertMaintenanceRequestSchema,
  updateMaintenanceRequestSchema,
} from '@/pocketbase/schemas/maintenanceRequests';
import {
  Collections,
  MaintenanceRequestsStatusOptions,
  MaintenanceRequestsUrgencyOptions,
} from '@/pocketbase/types';

export const CreateMaintenanceForm = withForm({
  defaultValues: {} as z.infer<typeof insertMaintenanceRequestSchema>,
  validators: {
    onChange: insertMaintenanceRequestSchema,
  },
  render: ({ form }) => {
    const [tenants, apartmentUnits, maintenanceWorker] = useSuspenseQueries({
      queries: [
        {
          queryKey: ['tenants'],
          queryFn: () => pb.collection(Collections.Tenants).getFullList(),
        },
        {
          queryKey: ['apartmentUnits'],
          queryFn: () =>
            pb.collection(Collections.ApartmentUnits).getFullList(),
        },
        {
          queryKey: ['maintenanceWorker'],
          queryFn: () =>
            pb.collection(Collections.MaintenanceWorkers).getFullList(),
        },
      ],
    });

    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={tenants.data.map((value) => ({
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
              options={apartmentUnits.data.map((value) => ({
                label: value.unitLetter,
                value: value.id,
              }))}
              placeholder="Unit"
            />
          )}
        </form.AppField>
        <form.AppField name="urgency">
          {(field) => (
            <field.SelectField
              options={Object.keys(MaintenanceRequestsUrgencyOptions).map(
                (value) => ({ label: value, value: value }),
              )}
              className="col-span-full"
              placeholder="Urgency"
            />
          )}
        </form.AppField>
        <form.AppField name="status">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={Object.keys(MaintenanceRequestsStatusOptions).map(
                (value) => ({ label: value, value: value }),
              )}
              placeholder="Status"
            />
          )}
        </form.AppField>
        <form.AppField name="worker">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={maintenanceWorker.data.map((value) => ({
                label: value.name,
                value: value.id,
              }))}
              placeholder="Worker"
            />
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextAreaField
              className="col-span-full"
              placeholder="Description"
            />
          )}
        </form.AppField>
        <form.AppField name="submittedDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              placeholder="Submitted Date"
            />
          )}
        </form.AppField>
        <form.AppField name="completedDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              placeholder="Completed Date"
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
    onChange: updateMaintenanceRequestSchema,
  },
  render: ({ form }) => (
    <>
      <form.AppField name="tenant">
        {(field) => <field.TextField placeholder="Tenant" />}
      </form.AppField>
      <form.AppField name="unit">
        {(field) => <field.TextField placeholder="Unit" />}
      </form.AppField>
      <form.AppField name="urgency">
        {(field) => <field.TextField placeholder="Urgency" />}
      </form.AppField>
      <form.AppField name="status">
        {(field) => <field.TextField placeholder="Status" />}
      </form.AppField>
      <form.AppField name="worker">
        {(field) => <field.TextField placeholder="Worker" />}
      </form.AppField>
      <form.AppField name="description">
        {(field) => <field.TextField placeholder="Description" />}
      </form.AppField>
      <form.AppField name="submittedDate">
        {(field) => <field.TextField placeholder="Submitted Date" />}
      </form.AppField>
    </>
  ),
});
