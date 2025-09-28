import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listBillsQuery } from '@/pocketbase/queries/bills';
import { billSchema } from '@/pocketbase/schemas/bills';
import CreateBillingDialogForm from './-actions/create';
import DeleteBillingDialogForm from './-actions/delete';
import EditBillingDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';

export const Route = createFileRoute('/dashboard/billing/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(billSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      listBillsQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const bills = Route.useLoaderData();

  return (
    <article>
      <section className="py-2.5">
        <h1 className="text-2xl font-bold">Billing</h1>
      </section>
      <section className='flex justify-between py-2.5'>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })
          }
        >
          Create Billing
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
            disabled={searchQuery.page >= bills.totalPages}
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
        <DataTable columns={columns} data={bills} />
      </section>
      <section>
        <CreateBillingDialogForm />
        <DeleteBillingDialogForm />
        <EditBillingDialogForm />
      </section>
    </article>
  );
}
