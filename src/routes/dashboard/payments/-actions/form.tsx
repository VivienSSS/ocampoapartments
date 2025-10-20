import { useSuspenseQueries } from '@tanstack/react-query';
import type z from 'zod';
import { format } from 'date-fns';
import { withForm } from '@/components/ui/form';
import { pb } from '@/pocketbase';
import {
  insertPaymentSchema,
  updatePaymentSchema,
} from '@/pocketbase/schemas/payments';
import { Collections, PaymentsPaymentMethodOptions } from '@/pocketbase/types';
import { AsyncSelect } from '@/components/ui/async-select';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';
import type { BillsResponse } from '@/pocketbase/queries/bills';

export const CreatePaymentForm = withForm({
  defaultValues: {} as z.infer<typeof insertPaymentSchema>,

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
                className='w-full'
                fetcher={async (query) => (await pb.collection(Collections.Tenants).getList<TenantsResponse>(1, 10, {
                  filter: query ? `user.firstName ~ '%${query}%' || user.lastName ~ '%${query}%' || user.contactEmail ~ '%${query}%'` : '',
                  expand: 'user',
                  requestKey: null
                })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => `${option.expand?.user?.firstName || ''} ${option.expand?.user?.lastName || ''}`.trim() || option.id}
                renderOption={(option) => (
                  <div>
                    <div className="font-medium">{`${option.expand?.user?.firstName || ''} ${option.expand?.user?.lastName || ''}`.trim() || option.id}</div>
                    {option.expand?.user?.contactEmail && (
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
        <form.AppField name="bill">
          {(field) => (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Bill
              </label>
              <AsyncSelect<BillsResponse>
                className='w-full'
                fetcher={async (query) => (await pb.collection(Collections.Bills).getList<BillsResponse>(1, 10, {
                  filter: query ? `tenancy.tenant.user.firstName ~ '%${query}%' || tenancy.tenant.user.lastName ~ '%${query}%'` : '',
                  expand: 'tenancy.tenant.user,tenancy.unit.property',
                  requestKey: null
                })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => {
                  const date = format(new Date(option.dueDate), 'PPP');
                  const firstName = option.expand?.tenancy?.expand?.tenant?.expand?.user?.firstName || '';
                  const lastName = option.expand?.tenancy?.expand?.tenant?.expand?.user?.lastName || '';
                  const fullName = `${firstName} ${lastName}`.trim();
                  return `${date} - ${fullName}` || option.id;
                }}
                renderOption={(option) => {
                  const date = format(new Date(option.dueDate), 'PPP');
                  const firstName = option.expand?.tenancy?.expand?.tenant?.expand?.user?.firstName || '';
                  const lastName = option.expand?.tenancy?.expand?.tenant?.expand?.user?.lastName || '';
                  const fullName = `${firstName} ${lastName}`.trim();
                  return (
                    <div>
                      <div className="font-medium">{`${date} - ${fullName}`}</div>
                      <div className="text-sm text-muted-foreground">
                        Status: {option.status}
                      </div>
                    </div>
                  );
                }}
                value={field.state.value || ''}
                onChange={field.handleChange}
                label="Bill"
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="paymentMethod">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={Object.keys(PaymentsPaymentMethodOptions).map(
                (value) => ({ label: value, value: value }),
              )}
              label="Payment Method"
            />
          )}
        </form.AppField>
        <form.AppField name="amountPaid">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Amount Paid"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="paymentDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              label="Payment Date"
            />
          )}
        </form.AppField>
        <form.AppField name="transactionId">
          {(field) => (
            <field.TextField
              className="col-span-full"
              label="Transaction ID and Proof of Payment"
              placeholder='ex. 12345678910'
            />
          )}
        </form.AppField>
        <form.AppField name="screenshot">
          {(field) => (
            <field.FileField
              className="col-span-full"
              label="Proof of Payment"
            />
          )}
        </form.AppField>
      </>
    );
  },
});

export const EditPaymentForm = withForm({
  defaultValues: {} as z.infer<typeof updatePaymentSchema>,
  validators: {
    onChange: updatePaymentSchema,
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
                className='w-full'
                fetcher={async (query) => (await pb.collection(Collections.Tenants).getList<TenantsResponse>(1, 10, {
                  filter: query ? `user.firstName ~ '%${query}%' || user.lastName ~ '%${query}%' || user.contactEmail ~ '%${query}%'` : '',
                  expand: 'user',
                  requestKey: null
                })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => `${option.expand?.user?.firstName || ''} ${option.expand?.user?.lastName || ''}`.trim() || option.id}
                renderOption={(option) => (
                  <div>
                    <div className="font-medium">{`${option.expand?.user?.firstName || ''} ${option.expand?.user?.lastName || ''}`.trim() || option.id}</div>
                    {option.expand?.user?.contactEmail && (
                      <div className="text-sm text-muted-foreground">
                        {option.expand.user.contactEmail}
                      </div>
                    )}
                  </div>
                )}
                value={field.state.value || ''}
                onChange={field.handleChange}
                placeholder="Tenant"
                label="Tenant"
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="bill">
          {(field) => (
            <div className="col-span-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Bill
              </label>
              <AsyncSelect<BillsResponse>
                className='w-full'
                fetcher={async (query) => (await pb.collection(Collections.Bills).getList<BillsResponse>(1, 10, {
                  filter: query ? `tenancy.tenant.user.firstName ~ '%${query}%' || tenancy.tenant.user.lastName ~ '%${query}%'` : '',
                  expand: 'tenancy.tenant.user,tenancy.unit.property',
                  requestKey: null
                })).items}
                getOptionValue={(option) => option.id}
                getDisplayValue={(option) => {
                  const date = format(new Date(option.dueDate), 'PPP');
                  const firstName = option.expand?.tenancy?.expand?.tenant?.expand?.user?.firstName || '';
                  const lastName = option.expand?.tenancy?.expand?.tenant?.expand?.user?.lastName || '';
                  const fullName = `${firstName} ${lastName}`.trim();
                  return `${date} - ${fullName}` || option.id;
                }}
                renderOption={(option) => {
                  const date = format(new Date(option.dueDate), 'PPP');
                  const firstName = option.expand?.tenancy?.expand?.tenant?.expand?.user?.firstName || '';
                  const lastName = option.expand?.tenancy?.expand?.tenant?.expand?.user?.lastName || '';
                  const fullName = `${firstName} ${lastName}`.trim();
                  return (
                    <div>
                      <div className="font-medium">{`${date} - ${fullName}`}</div>
                      <div className="text-sm text-muted-foreground">
                        Status: {option.status}
                      </div>
                    </div>
                  );
                }}
                value={field.state.value || ''}
                onChange={field.handleChange}
                placeholder="Bill"
                label="Bill"
              />
            </div>
          )}
        </form.AppField>
        <form.AppField name="paymentMethod">
          {(field) => (
            <field.SelectField
              className="col-span-full"
              options={Object.keys(PaymentsPaymentMethodOptions).map(
                (value) => ({ label: value, value: value }),
              )}
              placeholder="Payment Method"
            />
          )}
        </form.AppField>
        <form.AppField name="amountPaid">
          {(field) => (
            <field.TextField
              className="col-span-full"
              placeholder="Amount Paid"
              type="number"
            />
          )}
        </form.AppField>
        <form.AppField name="paymentDate">
          {(field) => (
            <field.DateField
              className="col-span-full"
              placeholder="Payment Date"
            />
          )}
        </form.AppField>
        <form.AppField name="transactionId">
          {(field) => (
            <field.TextField
              className="col-span-full"
              placeholder="Transaction ID"
            />
          )}
        </form.AppField>
      </>
    );
  },
});
