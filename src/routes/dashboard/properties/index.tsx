import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { pb } from '@/pocketbase';
import { Collections } from '@/pocketbase/types';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { searchParams } from '@/lib/utils';
import { propertySchema } from '@/pocketbase/schemas/properties';
import CreatePropertyDialogForm from './-actions/create';

export const Route = createFileRoute('/dashboard/properties/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(
    searchParams(propertySchema.keyof())
  ),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    pb
      .collection(Collections.Properties)
      .getList(context.search.page, context.search.perPage),
});

function RouteComponent() {
  const properties = Route.useLoaderData();

  return (
    <article>
      <section>Title</section>
      <section>Controls</section>
      <section>
        <DataTable columns={columns} data={properties} />
      </section>
      <section>
        <CreatePropertyDialogForm />
      </section>
    </article>
  );
}
