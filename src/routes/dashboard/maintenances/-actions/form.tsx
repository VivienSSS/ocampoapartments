import type z from 'zod';
import { AsyncSelect } from '@/components/ui/async-select';
import { withForm } from '@/components/ui/form';
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

export const CreateMaintenanceForm = withForm({
  defaultValues: {} as z.infer<typeof insertMaintenanceRequestSchema>,
  // validators: {
  //   onChange: insertMaintenanceRequestSchema,
  // },
  render: ({ form }) => {
    const userRole = pb.authStore.record?.role;
    const isTenant = userRole === UsersRoleOptions.Tenant;
    const userId = pb.authStore.record?.id;

    return (
      <>
        {!isTenant && (
          <form.AppField name="tenant">
            {(field) => (
              <div className="col-span-full">
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tenant
                </label>
                <AsyncSelect<TenantsResponse>
                  className="w-full"
                  fetcher={async (query) =>
                    (
                      await pb
                        .collection(Collections.Tenants)
                        .getList<TenantsResponse>(1, 10, {
                          filter: query
                            ? `facebookName ~ '%${query}%' || user.firstName ~ '%${query}%' || user.lastName ~ '%${query}%'`
                            : '',
                          expand: 'user',
                          requestKey: null,
                        })
                    ).items
                  }
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
        )}
        <form.AppField name="unit">
          {(field) => (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Unit
              </label>
              <AsyncSelect<ApartmentUnitsResponse>
                className="w-full"
                fetcher={async (query) => {
                  let units: ApartmentUnitsResponse[] = [];

                  // For tenants, only show their own units
                  if (isTenant && userId) {
                    // Get all tenancies for this tenant with tenant info expanded
                    const tenancies = await pb
                      .collection(Collections.Tenancies)
                      .getFullList<any>({
                        filter: `tenant.user = '${userId}'`,
                        expand: 'unit.property,tenant',
                        requestKey: null,
                      });

                    // Extract units from tenancies and enrich with tenant info
                    units = tenancies
                      .map((tenancy: any) => {
                        const unit = tenancy.expand?.unit;
                        if (unit && tenancy.expand?.tenant) {
                          (unit as any).tenantName =
                            tenancy.expand.tenant.facebookName;
                        }
                        return unit;
                      })
                      .filter((unit: any) => {
                        if (!unit) return false;
                        if (!query) return true;
                        const queryLower = query.toLowerCase();
                        return (
                          unit.unitLetter?.toLowerCase().includes(queryLower) ||
                          unit.floorNumber?.toString().includes(query) ||
                          unit.expand?.property?.branch
                            ?.toLowerCase()
                            .includes(queryLower)
                        );
                      });
                  } else {
                    // For admins, show all units with query filter and include tenant info
                    const filterCondition = query
                      ? `unitLetter ~ '%${query}%' || floorNumber ~ '%${query}%' || property.branch ~ '%${query}%'`
                      : '';

                    const unitsData = (
                      await pb
                        .collection(Collections.ApartmentUnits)
                        .getList<ApartmentUnitsResponse>(1, 100, {
                          filter: filterCondition,
                          expand: 'property',
                          requestKey: null,
                        })
                    ).items;

                    // Fetch all tenancies for these units in a single request
                    if (unitsData.length > 0) {
                      const tenancies = await pb
                        .collection(Collections.Tenancies)
                        .getFullList<any>({
                          filter: unitsData
                            .map((item) => `unit.id = '${item.id}'`)
                            .join(' || '),
                          expand: 'tenant',
                          requestKey: null,
                        });

                      // Create a map for quick lookup
                      const tenancyMap = new Map();
                      tenancies.forEach((tenancy: any) => {
                        if (tenancy.unit && tenancy.expand?.tenant) {
                          tenancyMap.set(
                            tenancy.unit,
                            tenancy.expand.tenant.facebookName,
                          );
                        }
                      });

                      // Enrich units with tenant info
                      unitsData.forEach((unit) => {
                        const tenantName = tenancyMap.get(unit.id);
                        if (tenantName) {
                          (unit as any).tenantName = tenantName;
                        }
                      });
                    }

                    units = unitsData;
                  }

                  return units;
                }}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) =>
                  `Unit ${option.unitLetter} - Floor ${option.floorNumber} - ${option.expand.property.branch}`
                }
                renderOption={(option) => (
                  <div>
                    <div>{`Unit ${option.unitLetter} - Floor ${option.floorNumber} - ${option.expand.property.branch}`}</div>
                    {(option as any).tenantName && (
                      <div className="text-sm text-muted-foreground">
                        {(option as any).tenantName}
                      </div>
                    )}
                  </div>
                )}
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
              label="Urgency"
            />
          )}
        </form.AppField>
        {/* <form.AppField name="status">
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
        </form.AppField> */}
        <form.AppField name="description">
          {(field) => (
            <field.TextAreaField
              className="col-span-full"
              label="Description"
              placeholder="ex. We have a broken faucet. . ."
            />
          )}
        </form.AppField>
        <form.AppField name="submittedDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
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
    onChange: updateMaintenanceRequestSchema,
  },
  render: ({ form }) => (
    <div className="space-y-4">
      <form.AppField name="status">
        {(field) => (
          <field.SelectField
            className="col-span-full"
            options={Object.keys(MaintenanceRequestsStatusOptions).map(
              (value) => ({ label: value, value: value }),
            )}
            label="Status"
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
              fetcher={async (query) =>
                (
                  await pb
                    .collection(Collections.MaintenanceWorkers)
                    .getList<MaintenanceWorkersResponse>(1, 10, {
                      filter: query
                        ? `name ~ '%${query}%' || contactDetails ~ '%${query}%'`
                        : '',
                      requestKey: null,
                    })
                ).items
              }
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
      <form.AppField name="completedDate">
        {(field) => (
          <field.DateField
            className="col-span-full"
            label="Completed Date"
            placeholder="Completed Date"
          />
        )}
      </form.AppField>
    </div>
  ),
});
