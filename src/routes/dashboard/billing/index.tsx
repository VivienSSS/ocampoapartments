import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import CreateBillingDialogForm from './-actions/create';
import LoadingComponent from './-loading';
import { columns } from './-table';
import DeleteBillingDialogForm from './-actions/delete';
import EditBillingDialogForm from './-actions/update';
import { billSchema } from '@/pocketbase/schemas/bills';
import { Button } from '@/components/ui/button';
import { listBillsQuery } from '@/pocketbase/queries/bills';

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
  const billing = Route.useLoaderData();

  return (
    <article>
      <section>Title</section>
      <section>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })
          }
        >
          Create Billing
        </Button>
      </section>
      <section>
        <DataTable columns={columns} data={billing} />
      </section>
      <section>
        <CreateBillingDialogForm />
        <DeleteBillingDialogForm />
        <EditBillingDialogForm />
      </section>
    </article>
  );
}
