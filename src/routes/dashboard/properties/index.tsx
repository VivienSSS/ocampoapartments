import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listPropertiesQuery } from '@/pocketbase/queries/properties';
import { propertySchema } from '@/pocketbase/schemas/properties';
import CreatePropertyDialogForm from './-actions/create';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { Button } from '@/components/ui/button';
import DeletePropertyDialogForm from './-actions/delete';
import EditPropertyDialogForm from './-actions/update';

export const Route = createFileRoute('/dashboard/properties/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(propertySchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      listPropertiesQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const properties = Route.useLoaderData();

  return (
    <article>
      <section>Title</section>
      <section>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })
          }
        >
          Create Property
        </Button>
      </section>
      <section>
        <DataTable columns={columns} data={properties} />
      </section>
      <section>
        <CreatePropertyDialogForm />
        <DeletePropertyDialogForm />
        <EditPropertyDialogForm />
      </section>
    </article>
  );
}
