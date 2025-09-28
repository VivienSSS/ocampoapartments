import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
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
      <section className="py-2.5">
        <h1 className="text-2xl font-bold">Maintenances</h1>
      </section>
      <section className='flex justify-between py-2.5'>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })
          }
        >
          Create Maintenance Request
        </Button>
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
            disabled={searchQuery.page >= maintenanceRequests.totalPages}
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
        <DataTable columns={columns} data={maintenanceRequests} />
      </section>
      <section>
        <CreateMaintenanceDialogForm />
        <DeleteMaintenanceDialogForm />
        <EditMaintenanceDialogForm />
      </section>
    </article>
  );
}
