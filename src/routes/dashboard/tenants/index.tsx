import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { searchParams } from '@/lib/utils';
import { listTenantsQuery, getCurrentTenantQuery } from '@/pocketbase/queries/tenants';
import { tenantSchema } from '@/pocketbase/schemas/tenants';
import CreateTenantDialogForm from './-actions/create';
import DeactivateTenantDialogForm from './-actions/deactivate';
import EditTenantDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { TenantProfile } from './-profile';
import { pb } from '@/pocketbase';
import { UsersRoleOptions } from '@/pocketbase/types';
import { ChevronLeft, ChevronRight, Plus, Edit, ShieldX, ArrowUpDown } from 'lucide-react';

export const Route = createFileRoute('/dashboard/tenants/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(tenantSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) => {
    // Load different data based on user role
    const userRole = pb.authStore.record?.role;
    if (userRole === UsersRoleOptions.Tenant) {
      // For tenants, get their own tenant record
      const userId = pb.authStore.record?.id;
      if (userId) {
        return context.queryClient.fetchQuery(getCurrentTenantQuery(userId));
      }
    } else {
      // For administrators, get all tenants
      const sortString = context.search.sort
        ? context.search.sort.map((s) => `${s.order === '-' ? '-' : ''}${s.field}`).join(',')
        : undefined;
      return context.queryClient.fetchQuery(
        listTenantsQuery(context.search.page, context.search.perPage, sortString),
      );
    }
    return null;
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const data = Route.useLoaderData();

  const userRole = pb.authStore.record?.role;
  const isTenant = userRole === UsersRoleOptions.Tenant;

  // For tenants, show profile view
  if (isTenant && data && 'facebookName' in data) {
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

  // For administrators, show table view
  const tenants = data as { page: number; perPage: number; totalItems: number; totalPages: number; items: any[] } | null;

  if (!tenants) {
    return (
      <article>
        <section className="flex items-center justify-between py-2.5">
          <h1 className="text-2xl font-bold">
            Tenants
          </h1>
        </section>
        <section>
          <p className="leading-7 [&:not(:first-child)]:mt-6 text-muted-foreground">
            No data available
          </p>
        </section>
      </article>
    );
  }

  return (
    <article className="space-y-4">
      {/* Controls Section */}
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <div className='flex gap-2.5'>
          <Button
            disabled={searchQuery.selected.length > 1}
            onClick={() =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  id: searchQuery.selected[0],
                  edit: true,
                }),
              })
            }
          >
            <Edit /> Edit
          </Button>
          <Button
            variant="destructive"
            disabled={searchQuery.selected.length !== 1}
            onClick={() =>
              navigate({
                search: (prev) => ({
                  ...prev,
                  deactivate: true,
                }),
              })
            }
          >
            <ShieldX /> Deactivate
          </Button>
          <Button
            disabled={searchQuery.page === 1}
            onClick={() =>
              navigate({
                search: (prev) => ({ ...prev, page: searchQuery.page - 1 }),
              })
            }
          >
            <ChevronLeft />
          </Button>
          <Button
            disabled={searchQuery.page >= tenants.totalPages}
            onClick={() =>
              navigate({
                search: (prev) => ({ ...prev, page: searchQuery.page + 1 }),
              })
            }
          >
            <ChevronRight />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <ArrowUpDown /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'facebookName', order: '+' }] }) })}>
                Name (A to Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'facebookName', order: '-' }] }) })}>
                Name (Z to A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'created', order: '-' }] }) })}>
                Newest to Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'created', order: '+' }] }) })}>
                Oldest to Newest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      <section>
        <DataTable columns={columns} data={tenants} />
      </section>
      <div className="flex justify-end py-2.5">
        <div className="flex gap-2">
          <Button
            className=''
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, new: true }) })
            }
          >
            <Plus /> Add
          </Button>
        </div>
      </div>

      {/* Forms Section */}
      <section>
        <CreateTenantDialogForm />
        <DeactivateTenantDialogForm />
        <EditTenantDialogForm />
      </section>
    </article>
  );
}
