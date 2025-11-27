import { withForm } from '@/components/ui/forms';
import type { Create, TypedPocketBase, Update } from '../types';
import { formOptions } from '@tanstack/react-form';
import { ClientResponseError } from 'pocketbase';
import type { UseNavigateResult } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Collections } from '../types';
import { FieldGroup, FieldSet } from '@/components/ui/field';

export const MaintenanceRequestForm = () =>
  withForm({
    defaultValues: {} as Update<'maintenance_requests'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <FieldSet>
            <FieldGroup>
              <form.AppField name="tenant">
                {(field) => (
                  <field.RelationField
                    relationshipName="tenant"
                    collection={Collections.Tenants}
                    placeholder="Select Tenant"
                    renderOption={(item) =>
                      String(item.phoneNumber || item.user || item.id)
                    }
                  />
                )}
              </form.AppField>
              <form.AppField name="unit">
                {(field) => (
                  <field.RelationField
                    relationshipName="unit"
                    collection={Collections.ApartmentUnits}
                    placeholder="Select Unit"
                    renderOption={(item) =>
                      String(`${item.unitLetter} - Floor ${item.floorNumber}`)
                    }
                  />
                )}
              </form.AppField>
              <form.AppField name="urgency">
                {(field) => (
                  <field.SelectField
                    label="Urgency"
                    placeholder="Select Urgency Level"
                    tooltip="How urgent is this maintenance request"
                    options={[
                      { label: 'Urgent', value: 'Urgent' },
                      { label: 'Normal', value: 'Normal' },
                      { label: 'Low', value: 'Low' },
                    ]}
                  />
                )}
              </form.AppField>
              <form.AppField name="status">
                {(field) => (
                  <field.SelectField
                    label="Status"
                    placeholder="Select Status"
                    tooltip="Current status of the maintenance request"
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
              <form.AppField name="worker">
                {(field) => (
                  <field.RelationField
                    relationshipName="worker"
                    collection={Collections.MaintenanceWorkers}
                    placeholder="Select Maintenance Worker"
                    renderOption={(item) => String(item.name || item.id)}
                  />
                )}
              </form.AppField>
              <form.AppField name="description">
                {(field) => (
                  <field.RichEditorField
                    label="Description"
                    tooltip="Detailed description of the problem"
                  />
                )}
              </form.AppField>
              <form.AppField name="submittedDate">
                {(field) => (
                  <field.DateTimeField
                    label="Submitted Date"
                    placeholder="Select Submission Date"
                    tooltip="When the request was submitted"
                  />
                )}
              </form.AppField>
              <form.AppField name="completedDate">
                {(field) => (
                  <field.DateTimeField
                    label="Completed Date"
                    placeholder="Select Completion Date"
                    tooltip="When the maintenance was completed"
                  />
                )}
              </form.AppField>
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
