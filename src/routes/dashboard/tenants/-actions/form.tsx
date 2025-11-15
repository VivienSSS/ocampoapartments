import type z from 'zod';
import { AsyncSelect } from '@/components/ui/async-select';
import { withForm } from '@/components/ui/forms';
import { pb } from '@/pocketbase';
import type {
  insertTenantSchema,
  updateTenantSchema,
} from '@/pocketbase/schemas/tenants';
import type { UsersResponse } from '@/pocketbase/types';
import { Collections, UsersRoleOptions } from '@/pocketbase/types';
import { useRouteContext } from '@tanstack/react-router';

export const CreateTenantForm = withForm({
  defaultValues: {} as z.infer<typeof insertTenantSchema>,
  render: ({ form }) => {
    const { pocketbase } = useRouteContext({ from: '/dashboard/tenants/' });

    return (
      <>
        <form.AppField name="user">
          {(field) => (
            <field.RelationField<UsersResponse>
              label="Tenant User"
              tooltip="Select the user associated with this tenant"
              description="Only users with the 'Tenant' role will be displayed"
              pocketbase={pocketbase}
              collectionName={Collections.Users}
              recordListOption={{
                filter: (query) => `${query ? `${query} ~ contactEmail &&` : ``} role = 'Tenant'`,
              }}
              relationshipName="user"
              renderOption={(item) =>
                `${item.firstName} ${item.lastName} - ${item.contactEmail}`
              }
            />
          )}
        </form.AppField>
        <form.AppField name="phoneNumber">
          {(field) => (
            <field.TextField
              tooltip="Enter the tenant's phone number"
              description="Include country code if applicable"
              className="col-span-full"
              label="Phone Number"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="facebookName">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="FaceBook Name"
              tooltip="Enter the tenant's Facebook name"
              description="This will be displayed on the tenant's profile"
            />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditTenantForm = withForm({
  defaultValues: {} as z.infer<typeof updateTenantSchema>,
  render: ({ form }) => {
    const { pocketbase } = useRouteContext({ from: '/dashboard/tenants/' });

    return (
      <>
        <form.AppField name="user">
          {(field) => (
            <field.RelationField<UsersResponse>
              label="Tenant User"
              tooltip="Select the user associated with this tenant"
              description="Only users with the 'Tenant' role will be displayed"
              pocketbase={pocketbase}
              collectionName={Collections.Users}
              recordListOption={{
                filter: (query) => `${query ? `${query} ~ contactEmail &&` : ``} role = 'Tenant'`,
              }}
              relationshipName="user"
              renderOption={(item) =>
                `${item.firstName} ${item.lastName} - ${item.contactEmail}`
              }
            />
          )}
        </form.AppField>
        <form.AppField name="phoneNumber">
          {(field) => (
            <field.TextField
              tooltip="Enter the tenant's phone number"
              description="This will be displayed on the tenant's profile"
              label="Phone Number"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="facebookName">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="FaceBook Name"
              tooltip="Enter the tenant's Facebook name"
              description="This will be displayed on the tenant's profile"
            />
          )}
        </form.AppField>
      </>
    );
  },
});
