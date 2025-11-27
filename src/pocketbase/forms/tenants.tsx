import { withForm } from '@/components/ui/forms';
import { Collections, type Update } from '../types';

export const TenantForm = () =>
  withForm({
    defaultValues: {} as Update<'tenants'>,
    render: ({ form }) => {
      return (
        <form.AppForm>
          <form.AppField name="user">
            {(field) => (
              <field.RelationField
                relationshipName="user"
                collection={Collections.Users}
                placeholder="Select User"
                renderOption={(item) =>
                  String(item.name || item.email || item.id)
                }
              />
            )}
          </form.AppField>
          <form.AppField name="phoneNumber">
            {(field) => (
              <field.NumberField
                label="Phone Number"
                placeholder="Enter Phone Number"
                tooltip="Contact phone number"
              />
            )}
          </form.AppField>
          <form.AppField name="facebookName">
            {(field) => (
              <field.TextField
                label="Facebook Name"
                placeholder="Enter Facebook Name"
                tooltip="Facebook account name for contact"
              />
            )}
          </form.AppField>
        </form.AppForm>
      );
    },
  });
