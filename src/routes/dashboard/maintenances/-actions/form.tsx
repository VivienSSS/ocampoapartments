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
import { AsyncSelect } from '@/components/ui/async-select';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';
import type { ApartmentUnitsResponse } from '@/pocketbase/queries/apartmentUnits';
import type { MaintenanceWorkersResponse } from '@/pocketbase/types';

export const CreateMaintenanceForm = withForm({
  defaultValues: {} as z.infer<typeof insertMaintenanceRequestSchema>,
  validators: {
    onChange: insertMaintenanceRequestSchema,
  },
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="tenant">
          {(field) => (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tenant
              </label>
              <AsyncSelect<TenantsResponse>
                className="w-full"
                fetcher={async (query) => (await pb.collection(Collections.Tenants).getList<TenantsResponse>(1, 10, {
                  filter: query ? `facebookName ~ '%${query}%' || user.firstName ~ '%${query}%' || user.lastName ~ '%${query}%'` : '',
                  expand: 'user',
                  requestKey: null
                })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => option.facebookName}
                renderOption={(option) => (
                  <div>
                    <div className="font-medium">{option.facebookName}</div>
                    {option.expand?.user && (
                      <div className="text-sm text-muted-foreground">
                        {option.expand.user.contactEmail}
                      </div>
                    )}
                  </div>
                )}
                value={field.state.value || ''}
                onChange={field.handleChange}
                label="Tenant"
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="unit">
          {(field) => (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Unit
              </label>
              <AsyncSelect<ApartmentUnitsResponse>
                className='w-full'
                fetcher={async (query) => (await pb.collection(Collections.ApartmentUnits).getList<ApartmentUnitsResponse>(1, 10, { filter: query ? `unitLetter ~ '%${query}%' || floorNumber ~ '%${query}%' || property.branch ~ '%${query}%'` : '', expand: 'property', requestKey: null })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => `Unit ${option.unitLetter} - Floor ${option.floorNumber} - ${option.expand.property.branch}`}
                renderOption={(option) => <div>{`Unit ${option.unitLetter} - Floor ${option.floorNumber} - ${option.expand.property.branch}`}</div>}
                value={field.state.value || ''}
                onChange={field.handleChange}
                label="Unit"
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="urgency">
          {(field) => (
            <field.SelectField
              options={Object.keys(MaintenanceRequestsUrgencyOptions).map(
                (value) => ({ label: value, value: value }),
              )}
              className="col-span-full"
              label='Urgency'
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
              label='Status'
            />
          )}
        </form.AppField>
        <form.AppField name="worker">
          {(field) => (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Worker
              </label>
              <AsyncSelect<MaintenanceWorkersResponse>
                className="w-full"
                fetcher={async (query) => (await pb.collection(Collections.MaintenanceWorkers).getList<MaintenanceWorkersResponse>(1, 10, {
                  filter: query ? `name ~ '%${query}%' || contactDetails ~ '%${query}%'` : '',
                  requestKey: null
                })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => option.name}
                renderOption={(option) => (
                  <div>
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.contactDetails}
                    </div>
                  </div>
                )}
                value={field.state.value || ''}
                onChange={field.handleChange}
                label="Worker"
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="description">
          {(field) => (
            <field.TextAreaField
              className="col-span-full"
              label='Description'
              placeholder="ex. We have a broken faucet. . ."
            />
          )}
        </form.AppField>
        <form.AppField name="submittedDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              label='Submitted Date'
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
    onChange: updateMaintenanceRequestSchema,
  },
  render: ({ form }) => (
    <>
      <form.AppField name="completedDate">
        {(field) => (
          <field.DateField
            className="col-span-full"
            label='Completed Date'
            placeholder="Completed Date"
          />
        )}
      </form.AppField>
    </>
  ),
});
