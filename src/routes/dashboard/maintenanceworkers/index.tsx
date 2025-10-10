import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash } from 'lucide-react';

import LoadingComponent from './-loading';
import { columns } from './-table';
import { searchParams } from '@/lib/utils';
import { maintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { listMaintenanceWorkersQuery } from '@/pocketbase/queries/maintenanceWorkers';
import { Button } from '@/components/ui/button';
import CreateWorkerDialogForm from './-actions/create';
import EditWorkerDialogForm from './-actions/update';
import DeleteWorkerDialogForm from './-actions/delete';

export const Route = createFileRoute('/dashboard/maintenanceworkers/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(
    searchParams(maintenanceWorkerSchema.keyof())
  ),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) => context.queryClient.fetchQuery(listMaintenanceWorkersQuery(context.search.page, context.search.perPage))
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const maintenanceWorkers = Route.useLoaderData();
  return (
    <article>
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Maintenance Workers</h1>
        <div className='flex gap-2.5'>
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
            disabled={!(searchQuery.id ?? (searchQuery.selected && searchQuery.selected.length > 0))}
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
          <Button disabled={searchQuery.page >= maintenanceWorkers.totalPages} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page + 1 }) })}>
            <ChevronRight />
          </Button>
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
