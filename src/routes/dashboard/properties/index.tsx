import { createFileRoute, redirect } from '@tanstack/react-router';
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
import { listPropertiesQuery } from '@/pocketbase/queries/properties';
import { propertySchema } from '@/pocketbase/schemas/properties';
import CreatePropertyDialogForm from './-actions/create';
import DeletePropertyDialogForm from './-actions/delete';
import EditPropertyDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { ChevronLeft, ChevronRight, Plus, Edit, ArrowUpDown } from 'lucide-react';
import { UsersRoleOptions } from '@/pocketbase/types';

export const Route = createFileRoute('/dashboard/properties/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(propertySchema.keyof())),
  beforeLoad: ({ search, context }) => {

    if (context.user.role !== UsersRoleOptions.Administrator) {

      if (context.user.role === UsersRoleOptions.Tenant) {
        throw redirect({ to: "/dashboard/tenant-overview" })
      }

    }

    return { search }
  },
  loader: ({ context }) => {
    const sortString = context.search.sort
      ? context.search.sort.map((s) => `${s.order === '-' ? '-' : ''}${s.field}`).join(',')
      : undefined;
    return context.queryClient.fetchQuery(
      listPropertiesQuery(context.search.page, context.search.perPage, sortString),
    );
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const properties = Route.useLoaderData();

  return (
    <article className="space-y-4">
      {/* Controls Section */}
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Properties</h1>
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
          {/* Delete button hidden for properties section */}
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
            disabled={searchQuery.page >= properties.totalPages}
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
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'address', order: '+' }] }) })}>
                Address (A to Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'address', order: '-' }] }) })}>
                Address (Z to A)
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
        <DataTable columns={columns} data={properties} />
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
        <CreatePropertyDialogForm />
        <DeletePropertyDialogForm />
        <EditPropertyDialogForm />
      </section>
    </article>
  );
}
