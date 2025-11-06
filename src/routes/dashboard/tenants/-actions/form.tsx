import type z from 'zod';
import { withForm } from '@/components/ui/form';
import {
  insertTenantSchema,
  type updateTenantSchema,
} from '@/pocketbase/schemas/tenants';
import type { UsersResponse } from '@/pocketbase/types';
import { Collections, UsersRoleOptions } from '@/pocketbase/types';
import { pb } from '@/pocketbase';
import { AsyncSelect } from '@/components/ui/async-select';

export const CreateTenantForm = withForm({
  defaultValues: {} as z.infer<typeof insertTenantSchema>,
  props: {} as {},
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="user">
          {(field) => (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                User's Email
              </label>
              <AsyncSelect<UsersResponse>
                className="w-full"
                fetcher={async (query) => (await pb.collection(Collections.Users).getList<UsersResponse>(1, 10, {
                  filter: `role = '${UsersRoleOptions.Tenant}'${query ? ` && (contactEmail ~ '%${query}%' || firstName ~ '%${query}%' || lastName ~ '%${query}%')` : ''}`,
                  requestKey: null
                })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => option.contactEmail}
                renderOption={(option) => (
                  <div className="flex flex-col">
                    <span>{option.contactEmail}</span>
                    <span className="text-sm text-muted-foreground">{`${option.firstName} ${option.lastName}`}</span>
                  </div>
                )}
                value={field.state.value || ''}
                onChange={field.handleChange}
                label="User's Email"
                placeholder="Search users by email or name..."
              />
            </div>
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
  props: {} as {},
  render: ({ form }) => (
    <>
      <form.AppField name="user">
        {(field) => (
          <div className="col-span-full">
            <label className="block text-sm font-medium text-foreground mb-2">
              User's Email
            </label>
            <AsyncSelect<UsersResponse>
              className="w-full"
              fetcher={async (query) => (await pb.collection(Collections.Users).getList<UsersResponse>(1, 10, {
                filter: `role = '${UsersRoleOptions.Tenant}'${query ? ` && (contactEmail ~ '%${query}%' || firstName ~ '%${query}%' || lastName ~ '%${query}%')` : ''}`,
                requestKey: null
              })).items}
              getOptionValue={(option) => option.id}
              getDisplayValue={(option) => option.contactEmail}
              renderOption={(option) => (
                <div className="flex flex-col">
                  <span>{option.contactEmail}</span>
                  <span className="text-sm text-muted-foreground">{`${option.firstName} ${option.lastName}`}</span>
                </div>
              )}
              value={field.state.value || ''}
              onChange={field.handleChange}
              label="User's Email"
              placeholder="Search users by email or name..."
            />
          </div>
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
  ),
});
