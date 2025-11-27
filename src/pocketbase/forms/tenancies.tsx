import { withForm } from '@/components/ui/forms';
import { Collections, type Update } from '../types';

export const TenancyForm = () =>
  withForm({
    defaultValues: {} as Update<'tenancies'>,
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
          <form.AppField name="leaseStartDate">
            {(field) => (
              <field.DateTimeField
                label="Lease Start Date"
                placeholder="Select Start Date"
                tooltip="When the lease begins"
              />
            )}
          </form.AppField>
          <form.AppField name="leaseEndDate">
            {(field) => (
              <field.DateTimeField
                label="Lease End Date"
                placeholder="Select End Date"
                tooltip="When the lease ends"
              />
            )}
          </form.AppField>
          <form.AppField name="hasSent">
            {(field) => (
              <field.BoolField
                label="Has Sent"
                tooltip="Whether lease document has been sent"
              />
            )}
          </form.AppField>
          <form.AppField name="contractDocument">
            {(field) => <field.FileField placeholder="Upload Lease Contract" />}
          </form.AppField>
        </form.AppForm>
      );
    },
  });
