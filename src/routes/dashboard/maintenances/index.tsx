import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { searchParams } from '@/lib/utils';
import { pb } from '@/pocketbase';
import { listMaintenanceRequestsQuery } from '@/pocketbase/queries/maintenanceRequests';
import { maintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import { UsersRoleOptions } from '@/pocketbase/types';
import CreateMaintenanceDialogForm from './-actions/create';
import DeleteMaintenanceDialogForm from './-actions/delete';
import EditMaintenanceDialogForm from './-actions/update';
import { MaintenanceRequestCards } from './-cards';
import LoadingComponent from './-loading';

export const Route = createFileRoute('/dashboard/maintenances/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(maintenanceRequestSchema.keyof())),
  beforeLoad: ({ search, context }) => {
    if (
      context.user.role !== UsersRoleOptions.Administrator &&
      context.user.role !== UsersRoleOptions.Tenant &&
      context.user.role !== UsersRoleOptions['Building Admin']
    ) {
      throw redirect({ to: '/dashboard' });
    }

    return { search };
  },
  loader: ({ context }) => {
    const sortString = context.search.sort
      ? context.search.sort
          .map((s) => `${s.order === '-' ? '-' : ''}${s.field}`)
          .join(',')
      : undefined;

    // Filter maintenance requests by tenant if user is a tenant
    let tenantFilter: string | undefined;
    const userRole = pb.authStore.record?.role;
    if (userRole === UsersRoleOptions.Tenant) {
      const userId = pb.authStore.record?.id;
      // Get tenant records for this user
      tenantFilter = `tenant.user = '${userId}'`;
    }

    return context.queryClient.fetchQuery(
      listMaintenanceRequestsQuery(
        context.search.page,
        3,
        sortString,
        tenantFilter,
      ),
    );
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const maintenanceRequests = Route.useLoaderData();
  const userRole = pb.authStore.record?.role;
  const isTenant = userRole === UsersRoleOptions.Tenant;

  return (
    <article className="space-y-4 grid grid-cols-12">
      {/* Controls Section */}
      <section className="col-span-full flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
        <div className="flex gap-2.5">
          {!isTenant && (
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
          )}
          {!isTenant && (
            <Button
              variant="destructive"
              disabled={!(searchQuery.id ?? searchQuery.selected?.length > 0)}
              onClick={() =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    delete: true,
                  }),
                })
              }
            >
              <Trash /> Delete
            </Button>
          )}
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
            disabled={searchQuery.page >= maintenanceRequests.totalPages}
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
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'submittedDate', order: '+' }],
                    }),
                  })
                }
              >
                Submitted Date (Earliest First)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'submittedDate', order: '-' }],
                    }),
                  })
                }
              >
                Submitted Date (Latest First)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'urgency', order: '+' }],
                    }),
                  })
                }
              >
                Urgency (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'urgency', order: '-' }],
                    }),
                  })
                }
              >
                Urgency (High to Low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      {/* DataTable Section */}
      <section className="col-span-full">
        <MaintenanceRequestCards data={maintenanceRequests.items} />
      </section>
      {pb.authStore.record?.role !== UsersRoleOptions['Building Admin'] && (
        <div className="col-span-full flex justify-end py-2.5">
          <div className="flex gap-2">
            <Button
              className=""
              onClick={() =>
                navigate({ search: (prev) => ({ ...prev, new: true }) })
              }
            >
              <Plus /> Add
            </Button>
          </div>
        </div>
      )}
      <section>
        {/* {pb.authStore.record?.role !== UsersRoleOptions['Building Admin'] && ( */}
        <CreateMaintenanceDialogForm />
        {/* )} */}
        <DeleteMaintenanceDialogForm />
        <EditMaintenanceDialogForm />
      </section>
    </article>
  );
}
