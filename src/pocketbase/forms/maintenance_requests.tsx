import { withForm } from '@/components/ui/forms';
import type {
  ApartmentUnitsResponse,
  CollectionResponses,
  Create,
  MaintenanceRequestsRecord,
  TenantsResponse,
  TypedPocketBase,
  Update,
} from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export const MaintenanceRequestForm = () =>
  withForm({
    defaultValues: {} as Update<'maintenance_requests'>,
    props: {} as {
      action?: 'create' | 'update';
      record: MaintenanceRequestsRecord;
    },
    render: ({ form, action, record }) => {
      const isFormLocked =
        record?.status === 'Completed' || record?.status === 'Cancelled';

      return (
        <form.AppForm>
          {isFormLocked && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This maintenance request cannot be edited because its status is{' '}
                {record?.status}. Only the status field can be modified to
                reopen this request.
              </AlertDescription>
            </Alert>
          )}
          <FieldSet>
            <FieldGroup>
              {action === 'create' && (
                <>
                  <form.AppField name="tenant">
                    {(field) => (
                      <field.RelationField<
                        TenantsResponse<{
                          user: CollectionResponses['users'];
                        }>
                      >
                        label="Tenant"
                        description="The tenant who submitted the maintenance request"
                        relationshipName="tenant"
                        collection={Collections.Tenants}
                        placeholder="Select Tenant"
                        tooltip="E.g. 'John Doe'"
                        recordListOption={{ expand: 'user' }}
                        renderOption={(item) =>
                          `${item.expand.user.firstName} ${item.expand.user.lastName}`
                        }
                        disabled={isFormLocked}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="unit">
                    {(field) => (
                      <field.RelationField<
                        ApartmentUnitsResponse<{
                          property: CollectionResponses['properties'];
                        }>
                      >
                        label="Unit"
                        description="The apartment unit where maintenance is needed"
                        relationshipName="unit"
                        collection={Collections.ApartmentUnits}
                        placeholder="Select Unit"
                        tooltip="E.g. 'Unit A - Floor 1'"
                        recordListOption={{ expand: 'property' }}
                        renderOption={(item) =>
                          String(
                            `${item.unitLetter} (${item.expand?.property?.branch || item.expand?.property?.address || 'Property'}) - Floor ${item.floorNumber}`,
                          )
                        }
                        disabled={isFormLocked}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="urgency">
                    {(field) => (
                      <field.SelectField
                        label="Urgency"
                        description="How urgent this maintenance request is"
                        placeholder="Select Urgency Level"
                        tooltip="E.g. 'Urgent' or 'Normal'"
                        options={[
                          { label: 'Urgent', value: 'Urgent' },
                          { label: 'Normal', value: 'Normal' },
                          { label: 'Low', value: 'Low' },
                        ]}
                        disabled={isFormLocked}
                      />
                    )}
                  </form.AppField>
                </>
              )}
              <form.AppField name="status">
                {(field) => (
                  <field.SelectField
                    label="Status"
                    description="The current progress status of the maintenance request"
                    placeholder="Select Status"
                    tooltip="E.g. 'Pending' or 'Completed'"
                    options={[
                      { label: 'Pending', value: 'Pending' },
                      { label: 'Worker Assigned', value: 'Worker Assigned' },
                      { label: 'In Progress', value: 'In Progress' },
                      { label: 'Completed', value: 'Completed' },
                      { label: 'Cancelled', value: 'Cancelled' },
                    ]}
                  />
                )}
              </form.AppField>
              {action === 'create' && (
                <>
                  <form.AppField name="worker">
                    {(field) => (
                      <field.RelationField
                        label="Worker"
                        description="The maintenance worker assigned to handle this request"
                        relationshipName="worker"
                        collection={Collections.MaintenanceWorkers}
                        placeholder="Select Maintenance Worker"
                        tooltip="E.g. 'Juan Martinez'"
                        recordListOption={{ expand: '' }}
                        renderOption={(item) => String(item.name || item.id)}
                        disabled={isFormLocked}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="description">
                    {(field) => (
                      <field.TextareaField
                        label="Description"
                        description="Detailed description of the maintenance problem or repair needed"
                        tooltip="E.g. 'Leaking faucet in kitchen sink'"
                        disabled={isFormLocked}
                      />
                    )}
                  </form.AppField>
                  {/* <form.AppField name="submittedDate">
                    {(field) => (
                      <field.DateTimeField
                        disablePastDates
                        label="Submitted Date"
                        description="The date and time when the request was submitted"
                        placeholder="Select Submission Date"
                        tooltip="E.g. 'April 10, 2024 2:00 PM'"
                        disabled={isFormLocked}
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="completedDate">
                    {(field) => (
                      <field.DateTimeField
                        disablePastDates
                        label="Completed Date"
                        description="The date and time when the maintenance was completed"
                        placeholder="Select Completion Date"
                        tooltip="E.g. 'April 12, 2024 10:30 AM'"
                        disabled={isFormLocked}
                      />
                    )}
                  </form.AppField> */}
                </>
              )}
            </FieldGroup>
          </FieldSet>
        </form.AppForm>
      );
    },
  });

export const CreateMaintenanceRequestFormOption = formOptions({
  defaultValues: {} as Create<'maintenance_requests'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('maintenance_requests')
        .create(value);

      toast.success('Maintenance request created successfully', {
        description: `A maintenance request with ID ${response.id} has been created.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 400) {
          toast.error('Validation error: Please check your input fields.');
          formApi.setErrorMap({ onSubmit: { fields: error.data.data } });
        }
      }
    }
  },
});

export const UpdateMaintenanceRequestFormOption = formOptions({
  defaultValues: {} as Update<'maintenance_requests'>,
  onSubmitMeta: {} as {
    pocketbase: TypedPocketBase;
    id: string;
    navigate: UseNavigateResult<'/dashboard/$collection'>;
  },
  onSubmit: async ({ value, meta, formApi }) => {
    try {
      const response = await meta.pocketbase
        .collection('maintenance_requests')
        .update(meta.id, value);

      toast.success('Maintenance request updated successfully', {
        description: `A maintenance request with ID ${response.id} has been updated.`,
      });

      formApi.reset();

      meta.navigate({
        search: (prev) => ({ ...prev, action: undefined, selected: [] }),
      });
    } catch (error) {
      if (error instanceof ClientResponseError) {
        if (error.status === 400) {
          toast.error('Validation error: Please check your input fields.');
          formApi.setErrorMap({ onSubmit: { fields: error.data.data } });
        }
      }
    }
  },
});
