import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { pb } from '@/pocketbase';
import { Collections } from '@/pocketbase/types';

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
      <section className="py-2.5">
        <h1 className="text-2xl font-bold">Maintenance Workers</h1>
      </section>
      <section className='flex justify-between py-2.5'>
        <Button onClick={() => navigate({ search: (prev) => ({ ...prev, new: true }) })}>Create Worker</Button>
        <div className='flex gap-2.5'>
          <Button
            disabled={searchQuery.page === 1}
            onClick={() =>
              navigate({
                search: (prev) => ({ ...prev, page: searchQuery.page - 1 }),
              })
            }
          >
            Prev
          </Button>
          <Button
            disabled={searchQuery.page >= maintenanceWorkers.totalPages}
            onClick={() =>
              navigate({
                search: (prev) => ({ ...prev, page: searchQuery.page + 1 }),
              })
            }
          >
            Next
          </Button>
        </div>
      </section>
      <section>
        <DataTable columns={columns} data={maintenanceWorkers} />
      </section>
      <section>
        <CreateWorkerDialogForm />
        <EditWorkerDialogForm />
        <DeleteWorkerDialogForm />
      </section>
    </article>
  );
}
