import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import z from "zod";
import DataTable from "@/components/ui/kibo-ui/table/data-table";
import { pb } from "@/pocketbase";
import { Collections } from "@/pocketbase/types";
import CreateApartmentDialogForm from "./-actions/create";
import LoadingComponent from "./-loading";
import { columns } from "./-table";
import { listApartmentUnitsQuery } from "@/pocketbase/queries/apartmentUnits";

export const Route = createFileRoute("/dashboard/apartments/")({
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
    context.queryClient.fetchQuery(
      listApartmentUnitsQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const apartmentUnits = Route.useLoaderData();

  return (
    <article>
      <section></section>
      <section></section>
      <section>
        <DataTable columns={columns} data={apartmentUnits} />
      </section>
      <section>
        <CreateApartmentDialogForm />
      </section>
    </article>
  );
}
