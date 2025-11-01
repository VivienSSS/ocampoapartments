import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listBillsQuery } from '@/pocketbase/queries/bills';
import { billSchema } from '@/pocketbase/schemas/bills';
import { pb } from '@/pocketbase';
import { UsersRoleOptions } from '@/pocketbase/types';
import CreateBillingDialogForm from './-actions/create';
import DeleteBillingDialogForm from './-actions/delete';
import EditBillingDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash } from 'lucide-react';
import { BillsByStatusChart, BillItemAnalysisChart, FinancialOverviewChart } from '@/components/ui/charts';

export const Route = createFileRoute('/dashboard/billing/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(billSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: async ({ context }) => {

    const bills = await context.queryClient.fetchQuery(
      listBillsQuery(context.search.page, context.search.perPage),
    );

    // get analytics data by using fetchQuery

    return { bills }
  }
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const data = Route.useLoaderData();
  const bills = data.bills;

  return (
    <article className="space-y-4">
      {/* Charts Section */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <FinancialOverviewChart />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <BillsByStatusChart />
          <BillItemAnalysisChart />
        </div>
      </section>

      {/* Controls Section */}
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Billing</h1>
        <div className='flex gap-2.5'>

          {pb.authStore.record?.role !== UsersRoleOptions.Tenant && (
            <>
              <Button
                disabled={searchQuery.selected.length > 1}
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      id: searchQuery.selected[0],
                      edit: true,
                    }),
                  })
                }
              >
                <Edit /> Edit
              </Button>
              <Button
                variant="destructive"
                disabled={!(searchQuery.id ?? searchQuery.selected)}
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      delete: true,
                    }),
                  })
                }
              >
                <Trash /> Delete
              </Button>
            </>
          )}
          <Button disabled={searchQuery.page === 1} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page - 1 }) })}>
            <ChevronLeft />
          </Button>
          <Button disabled={searchQuery.page >= bills.totalPages} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page + 1 }) })}>
            <ChevronRight />
          </Button>
        </div>
      </section>
      <section>
        <DataTable columns={columns} data={bills} />
      </section>
      <div className="flex justify-end py-2.5">
        <div className="flex gap-2">
          <Button className=''
            onClick={() => {
              if (pb.authStore.record?.role === UsersRoleOptions.Tenant) {
                navigate({ to: "/dashboard/payments", search: { new: true } })
              } else {
                navigate({ search: (prev) => ({ ...prev, new: true }) })
              }
            }
            }
          >
            <Plus /> Add
          </Button>
        </div>
      </div>

      {/* Forms Section */}
      <section>
        {pb.authStore.record?.role !== UsersRoleOptions.Tenant && (
          <>
            <CreateBillingDialogForm />
            <DeleteBillingDialogForm />
            <EditBillingDialogForm />
          </>
        )}

      </section>
    </article>
  );
}
