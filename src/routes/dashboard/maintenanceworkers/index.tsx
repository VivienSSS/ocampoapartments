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
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listMaintenanceWorkersQuery } from '@/pocketbase/queries/maintenanceWorkers';
import { maintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { UsersRoleOptions } from '@/pocketbase/types';
import CreateWorkerDialogForm from './-actions/create';
import DeleteWorkerDialogForm from './-actions/delete';
import EditWorkerDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';

export const Route = createFileRoute('/dashboard/maintenanceworkers/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(maintenanceWorkerSchema.keyof())),
  beforeLoad: ({ search, context }) => {
    if (context.user.role !== UsersRoleOptions.Administrator) {
      if (context.user.role === UsersRoleOptions.Tenant) {
        throw redirect({ to: '/dashboard/tenant-overview' });
      }
    }

    return { search };
  },
  loader: ({ context }) => {
    const sortString = context.search.sort
      ? context.search.sort
          .map((s) => `${s.order === '-' ? '-' : ''}${s.field}`)
          .join(',')
      : undefined;
    return context.queryClient.fetchQuery(
      listMaintenanceWorkersQuery(
        context.search.page,
        context.search.perPage,
        sortString,
      ),
    );
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const maintenanceWorkers = Route.useLoaderData();
  return (
    <article>
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Maintenance Workers</h1>
        <div className="flex gap-2.5">
          <Button
            disabled={searchQuery.selected.length !== 1}
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
            disabled={
              !(
                searchQuery.id ??
                (searchQuery.selected && searchQuery.selected.length > 0)
              )
            }
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
            disabled={searchQuery.page >= maintenanceWorkers.totalPages}
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
                      sort: [{ field: 'name', order: '+' }],
                    }),
                  })
                }
              >
                Name (A to Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'name', order: '-' }],
                    }),
                  })
                }
              >
                Name (Z to A)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'created', order: '-' }],
                    }),
                  })
                }
              >
                Newest to Oldest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'created', order: '+' }],
                    }),
                  })
                }
              >
                Oldest to Newest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      <section>
        <DataTable columns={columns} data={maintenanceWorkers} />
      </section>
      <div className="flex justify-end py-2.5">
        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, new: true }) })
            }
          >
            <Plus /> Add
          </Button>
        </div>
      </div>
      <section>
        <CreateWorkerDialogForm />
        <EditWorkerDialogForm />
        <DeleteWorkerDialogForm />
      </section>
    </article>
  );
}
