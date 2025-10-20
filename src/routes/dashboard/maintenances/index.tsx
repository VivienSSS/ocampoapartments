import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listMaintenanceRequestsQuery } from '@/pocketbase/queries/maintenanceRequests';
import { maintenanceRequestSchema } from '@/pocketbase/schemas/maintenanceRequests';
import CreateMaintenanceDialogForm from './-actions/create';
import DeleteMaintenanceDialogForm from './-actions/delete';
import EditMaintenanceDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash } from 'lucide-react';
import { pb } from '@/pocketbase';
import { UsersRoleOptions } from '@/pocketbase/types';

export const Route = createFileRoute('/dashboard/maintenances/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(maintenanceRequestSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      listMaintenanceRequestsQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const maintenanceRequests = Route.useLoaderData();
  return (
    <article>
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Maintenance Requests</h1>
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
          <Button disabled={searchQuery.page === 1} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page - 1 }) })}>
            <ChevronLeft />
          </Button>
          <Button disabled={searchQuery.page >= maintenanceRequests.totalPages} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page + 1 }) })}>
            <ChevronRight />
          </Button>
        </div>
      </section>
      <section>
        <DataTable columns={columns} data={maintenanceRequests} />
      </section>
      {pb.authStore.record?.role !== UsersRoleOptions['Building Admin'] && (
        <div className="flex justify-end py-2.5">
          <div className="flex gap-2">
            <Button className=''
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
        {pb.authStore.record?.role !== UsersRoleOptions['Building Admin'] && (
          <CreateMaintenanceDialogForm />
        )}
        <DeleteMaintenanceDialogForm />
        <EditMaintenanceDialogForm />
      </section>
    </article>
  );
}
