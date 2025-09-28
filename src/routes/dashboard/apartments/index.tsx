import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listApartmentUnitsQuery } from '@/pocketbase/queries/apartmentUnits';
import { apartmentUnitSchema } from '@/pocketbase/schemas/apartmentUnits';
// ...existing code
import CreateApartmentDialogForm from './-actions/create';
import DeleteApartmentDialogForm from './-actions/delete';
import EditApartmentDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';

export const Route = createFileRoute('/dashboard/apartments/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(apartmentUnitSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      listApartmentUnitsQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const apartmentUnits = Route.useLoaderData();

  return (
    <article>
      <section className="py-2.5">
        <h1 className="text-2xl font-bold">Apartments</h1>
      </section>
      <section className='flex justify-between py-2.5'>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })
          }
        >
          Create Apartment
        </Button>
        <div className='flex gap-2.5'>
          <Button disabled={searchQuery.page === 1} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page - 1 }) })}>
            Prev
          </Button>
          <Button disabled={searchQuery.page >= apartmentUnits.totalPages} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page + 1 }) })}>
            Next
          </Button>
        </div>
      </section>
      <section>
        <DataTable columns={columns} data={apartmentUnits} />
      </section>
      <section>
        <CreateApartmentDialogForm />
        <DeleteApartmentDialogForm />
        <EditApartmentDialogForm />
      </section>
    </article>
  );
}
