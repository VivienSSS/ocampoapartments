import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import DataTable from "@/components/ui/kibo-ui/table/data-table";
import { searchParams } from "@/lib/utils";
// ...existing code
import CreateApartmentDialogForm from "./-actions/create";
import LoadingComponent from "./-loading";
import { columns } from "./-table";
import { listApartmentUnitsQuery } from "@/pocketbase/queries/apartmentUnits";
import DeleteApartmentDialogForm from "./-actions/delete";
import EditApartmentDialogForm from "./-actions/update";
import { apartmentUnitSchema } from "@/pocketbase/schemas/apartmentUnits";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/apartments/")({
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
  const apartmentUnits = Route.useLoaderData();

  return (
    <article>
      <section>Title</section>
      <section>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })}
        >
          Create Apartment
        </Button>
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
