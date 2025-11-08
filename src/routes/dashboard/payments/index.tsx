import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { ArrowUpDown, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PaymentMethodsDistributionChart } from '@/components/ui/charts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { pb } from '@/pocketbase';
import { listPaymentsQuery } from '@/pocketbase/queries/payments';
import { paymentSchema } from '@/pocketbase/schemas/payments';
import { UsersRoleOptions } from '@/pocketbase/types';
import CreatePaymentDialogForm from './-actions/create';
import { PaymentCards } from './-cards';
import LoadingComponent from './-loading';
import { columns } from './-table';

export const Route = createFileRoute('/dashboard/payments/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(paymentSchema.keyof())),
  beforeLoad: ({ search, context }) => {
    if (
      context.user.role !== UsersRoleOptions.Administrator &&
      context.user.role !== UsersRoleOptions.Tenant
    ) {
      throw redirect({ to: '/dashboard' });
    }

    return { search };
  },
  loader: ({ context }) => {
    const userRole = pb.authStore.record?.role;
    const isTenant = userRole === UsersRoleOptions.Tenant;
    // Use perPage of 3 for tenants, otherwise use the search value
    const perPage = isTenant ? 3 : context.search.perPage;
    const sortString = context.search.sort
      ? context.search.sort
          .map((s) => `${s.order === '-' ? '-' : ''}${s.field}`)
          .join(',')
      : undefined;
    return context.queryClient.fetchQuery(
      listPaymentsQuery(context.search.page, perPage, sortString),
    );
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const payments = Route.useLoaderData();
  const userRole = pb.authStore.record?.role;
  const isTenant = userRole === UsersRoleOptions.Tenant;

  return (
    <article className="space-y-4">
      {/* Charts Section - Hidden for Tenants */}
      {!isTenant && (
        <section className="space-y-4">
          <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight">
            Payment Analytics
          </h2>
          <PaymentMethodsDistributionChart />
        </section>
      )}

      {/* Controls Section */}
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Payments</h1>
        <div className="flex gap-2.5">
          <Button
            disabled={searchQuery.page === 1}
            onClick={() =>
              navigate({
                search: (prev) => ({ ...prev, page: searchQuery.page - 1 }),
              })
            }
          >
            <ChevronLeft />
          </Button>
          <Button
            disabled={searchQuery.page >= payments.totalPages}
            onClick={() =>
              navigate({
                search: (prev) => ({ ...prev, page: searchQuery.page + 1 }),
              })
            }
          >
            <ChevronRight />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <ArrowUpDown /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'paymentDate', order: '+' }],
                    }),
                  })
                }
              >
                Payment Date (Earliest First)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'paymentDate', order: '-' }],
                    }),
                  })
                }
              >
                Payment Date (Latest First)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'amountPaid', order: '+' }],
                    }),
                  })
                }
              >
                Amount (Low to High)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'amountPaid', order: '-' }],
                    }),
                  })
                }
              >
                Amount (High to Low)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      <section>
        {isTenant ? (
          <PaymentCards data={payments.items} />
        ) : (
          <DataTable columns={columns} data={payments} />
        )}
      </section>
      <div className="flex justify-end py-2.5">
        <div className="flex gap-2">
          <Button
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, new: true }) })
            }
          >
            <Plus /> Add
          </Button>
        </div>
      </div>

      {/* Forms Section */}
      <section>
        <CreatePaymentDialogForm />
      </section>
    </article>
  );
}
