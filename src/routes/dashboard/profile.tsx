import { searchParams } from '@/lib/utils';
import {
  getCurrentTenantQuery,
  listTenantsQuery,
} from '@/pocketbase/queries/tenants';
import { tenantSchema } from '@/pocketbase/schemas/tenants';
import { UsersRoleOptions } from '@/pocketbase/types';
import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { TenantProfile } from './-tenant-profile';

export const Route = createFileRoute('/dashboard/profile')({
  component: RouteComponent,
  validateSearch: zodValidator(searchParams(tenantSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) => {
    // Load different data based on user role
    const userRole = context.pocketbase.authStore.record?.role;
    if (userRole === UsersRoleOptions.Tenant) {
      // For tenants, get their own tenant record
      const userId = context.pocketbase.authStore.record?.id;
      if (userId) {
        return context.queryClient.fetchQuery(getCurrentTenantQuery(userId));
      }
    } else {
      // For administrators, get all tenants
      const sortString = context.search.sort
        ? context.search.sort
            .map((s) => `${s.order === '-' ? '-' : ''}${s.field}`)
            .join(',')
        : undefined;
      return context.queryClient.fetchQuery(
        listTenantsQuery(
          context.search.page,
          context.search.perPage,
          sortString,
        ),
      );
    }
    return null;
  },
});

function RouteComponent() {
  const data = Route.useLoaderData();
  const { pocketbase } = Route.useRouteContext();

  const userRole = pocketbase.authStore.record?.role;
  const isTenant = userRole === UsersRoleOptions.Tenant;

  if (isTenant && data && 'facebookName' in data) {
    // For tenants, show profile view
    return (
      <article>
        <section className="flex items-center justify-between py-2.5">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance">
            Your Information
          </h1>
        </section>
        <section>
          <TenantProfile tenant={data} />
        </section>
      </article>
    );
  }

  return <div>Hello "/dashboard/profile"!</div>;
}
