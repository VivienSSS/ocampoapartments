import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { searchParams } from "@/lib/utils";
import { tenanciesSchema } from "@/pocketbase/schemas/tenancies";
import DataTable from "@/components/ui/kibo-ui/table/data-table";
import CreateTenantDialogForm from "./-actions/create";
import LoadingComponent from "./-loading";
import { columns } from "./-table";
import { listTenanciesQuery } from "@/pocketbase/queries/tenancies";
import { Button } from "@/components/ui/button";
import EditTenancyDialogForm from "./-actions/update";
import DeleteTenancyDialogForm from "./-actions/delete";

export const Route = createFileRoute("/dashboard/tenancies/")({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(tenanciesSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      listTenanciesQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const tenants = Route.useLoaderData();

  return (
    <article>
      <section></section>
      <section>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })}
        >
          Create Resident
        </Button>
      </section>
      <section>
        <DataTable columns={columns} data={tenants} />
      </section>
      <section>
        <CreateTenantDialogForm />
        <EditTenancyDialogForm />
        <DeleteTenancyDialogForm />
      </section>
    </article>
  );
}
