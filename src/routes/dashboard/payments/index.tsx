import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listPaymentsQuery } from '@/pocketbase/queries/payments';
import { paymentSchema } from '@/pocketbase/schemas/payments';
import CreatePaymentDialogForm from './-actions/create';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/dashboard/payments/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(paymentSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      listPaymentsQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const payments = Route.useLoaderData();
  return (
    <article>
      <section className="py-2.5">
        <h1 className="text-2xl font-bold">Payments</h1>
      </section>
      <section className='flex justify-between py-2.5'>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })
          }
        >
          Create Payment
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
            disabled={searchQuery.page >= payments.totalPages}
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
        <DataTable columns={columns} data={payments} />
      </section>
      <section>
        <CreatePaymentDialogForm />
      </section>
    </article>
  );
}
