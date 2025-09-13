import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { pb } from '@/pocketbase';
import { Collections } from '@/pocketbase/types';
import LoadingComponent from './-loading';
import { columns } from './-table';
import CreateBillingDialogForm from './-actions/create';

export const Route = createFileRoute('/dashboard/billing/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(
    z.object({
      page: z.number().nonnegative().default(1).catch(1),
      perPage: z.number().nonnegative().default(10).catch(10),
    }),
  ),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    pb
      .collection(Collections.Bills)
      .getList(context.search.page, context.search.perPage, {
        sort: "-created"
      }),
});

function RouteComponent() {
  const billing = Route.useLoaderData();
  return (
    <article>
      <section></section>
      <section></section>
      <section>
        <DataTable columns={columns} data={billing} />
      </section>
      <section>
        <CreateBillingDialogForm />
      </section>
    </article>
  );
}
