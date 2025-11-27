import { withForm } from '@/components/ui/forms';
import { Collections, type Update } from '../types';

export const MaintenanceRequestForm = () =>
  withForm({
    defaultValues: {} as Update<'maintenance_requests'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
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
                  { label: 'Low', value: 'low' },
                  { label: 'Medium', value: 'medium' },
                  { label: 'High', value: 'high' },
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
                  { label: 'Pending', value: 'pending' },
                  { label: 'In Progress', value: 'in_progress' },
                  { label: 'Completed', value: 'completed' },
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
        </form.AppForm>
      );
    },
  });
