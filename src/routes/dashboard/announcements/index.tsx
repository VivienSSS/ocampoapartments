import { createFileRoute, redirect } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { searchParams } from '@/lib/utils';
import { listAnnouncementsQuery } from '@/pocketbase/queries/announcements';
import { announcementSchema } from '@/pocketbase/schemas/announcements';
import CreateAnnouncementDialogForm from './-actions/create';
import DeleteAnnouncementDialogForm from './-actions/delete';
import EditAnnouncementDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';
import { ChevronLeft, ChevronRight, Plus, Edit, Trash, ArrowUpDown } from 'lucide-react';
import { UsersRoleOptions } from '@/pocketbase/types';

export const Route = createFileRoute('/dashboard/announcements/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(announcementSchema.keyof())),
  beforeLoad: ({ search, context }) => {

    if (context.user.role !== UsersRoleOptions.Administrator) {

      if (context.user.role === UsersRoleOptions.Tenant) {
        throw redirect({ to: "/dashboard/tenant-overview" })
      }

    }

    return { search }
  },
  loader: ({ context }) => {
    const sortString = context.search.sort
      ? context.search.sort.map((s) => `${s.order === '-' ? '-' : ''}${s.field}`).join(',')
      : undefined;
    return context.queryClient.fetchQuery(
      listAnnouncementsQuery(context.search.page, context.search.perPage, sortString),
    );
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const announcements = Route.useLoaderData();
  return (
    <article className="space-y-4">
      {/* Controls Section */}
      <section className="flex items-center justify-between py-2.5">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <div className='flex gap-2.5'>
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
          <Button disabled={searchQuery.page === 1} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page - 1 }) })}>
            <ChevronLeft />
          </Button>
          <Button disabled={searchQuery.page >= announcements.totalPages} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page + 1 }) })}>
            <ChevronRight />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <ArrowUpDown /> Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'title', order: '+' }] }) })}>
                Title (A to Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'title', order: '-' }] }) })}>
                Title (Z to A)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'created', order: '-' }] }) })}>
                Newest to Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ search: (prev) => ({ ...prev, sort: [{ field: 'created', order: '+' }] }) })}>
                Oldest to Newest
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </section>
      {/* DataTable Section */}
      <section>
        <DataTable columns={columns} data={announcements} />
      </section>
      <div className="flex justify-end py-2.5">
        <div className="flex gap-2">
          <Button className=''
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, new: true }) })
            }
          >
            <Plus /> Add
          </Button>
        </div>
      </div>
      <section>
        <CreateAnnouncementDialogForm />
        <DeleteAnnouncementDialogForm />
        <EditAnnouncementDialogForm />
      </section>
    </article>
  );
}
