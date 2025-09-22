import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { searchParams } from '@/lib/utils';
import { paymentSchema } from '@/pocketbase/schemas/payments';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { listPaymentsQuery } from '@/pocketbase/queries/payments';
import CreatePaymentDialogForm from './-actions/create';
import LoadingComponent from './-loading';
import { columns } from './-table';

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
  const payments = Route.useLoaderData();
  return (
    <article>
      <section></section>
      <section></section>
      <section>
        <DataTable columns={columns} data={payments} />
      </section>
      <section>
        <CreatePaymentDialogForm />
      </section>
    </article>
  );
}
