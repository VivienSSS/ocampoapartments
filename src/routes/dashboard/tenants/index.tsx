import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listTenantsQuery } from '@/pocketbase/queries/tenants';
import { tenantSchema } from '@/pocketbase/schemas/tenants';
import CreateTenantDialogForm from './-actions/create';
import DeleteTenantDialogForm from './-actions/delete';
import EditTenantDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';

export const Route = createFileRoute('/dashboard/tenants/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(tenantSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      listTenantsQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const tenants = Route.useLoaderData();

  return (
    <article>
      <section className="py-2.5">
        <h1 className="text-2xl font-bold">Tenants</h1>
      </section>
      <section className='flex justify-between py-2.5'>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })
          }
        >
          Create Tenant
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
            disabled={searchQuery.page >= tenants.totalPages}
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
        <DataTable columns={columns} data={tenants} />
      </section>
      <section>
        <CreateTenantDialogForm />
        <DeleteTenantDialogForm />
        <EditTenantDialogForm />
      </section>
    </article>
  );
}
