import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listInqueryQuery } from '@/pocketbase/queries/inquries';
import { UsersRoleOptions } from '@/pocketbase/types';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { inquirySchema } from '@/pocketbase/schemas/inquiry';

export const Route = createFileRoute('/dashboard/inquiries/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(inquirySchema.keyof())),
  beforeLoad: ({ search, context }) => {
    if (context.user.role !== UsersRoleOptions.Administrator) {
      throw redirect({ to: '/dashboard' });
    }
    return { search };
  },
  loader: ({ context }) => {
    const sortString = context.search.sort
      ? context.search.sort
        .map((s) => `${s.order === '-' ? '-' : ''}${s.field}`)
        .join(',')
      : undefined;
    return context.queryClient.fetchQuery(
      listInqueryQuery(
        context.search.page,
        context.search.perPage,
        sortString,
      ),
    );
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const inquiries = Route.useLoaderData();

  return (
    <article className="space-y-4">
      {/* Controls Section */}
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Inquiries</h1>
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
            disabled={searchQuery.page >= inquiries.totalPages}
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
                      sort: [{ field: 'firstName', order: '+' }],
                    }),
                  })
                }
              >
                Name (A to Z)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'firstName', order: '-' }],
                    }),
                  })
                }
              >
                Name (Z to A)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'updated', order: '-' }],
                    }),
                  })
                }
              >
                Newest to Oldest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    search: (prev) => ({
                      ...prev,
                      sort: [{ field: 'updated', order: '+' }],
                    }),
                  })
                }
              >
                Oldest to Newest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      <section>
        <DataTable columns={columns} data={inquiries} />
      </section>
    </article>
  );
}
