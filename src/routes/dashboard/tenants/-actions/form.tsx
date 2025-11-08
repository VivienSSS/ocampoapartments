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
              pocketbase={pocketbase}
              collectionName={Collections.Users}
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
              className="col-span-full"
              label="Phone Number"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="facebookName">
          {(field) => (
            <field.TextField className="col-span-full" label="FaceBook Name" />
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
              pocketbase={pocketbase}
              collectionName={Collections.Users}
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
              className="col-span-full"
              label="Phone Number"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="facebookName">
          {(field) => (
            <field.TextField className="col-span-full" label="FaceBook Name" />
          )}
        </form.AppField>
      </>
    );
  },
});
