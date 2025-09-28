import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { searchParams } from '@/lib/utils';
import { listAnnouncementsQuery } from '@/pocketbase/queries/announcements';
import { announcementSchema } from '@/pocketbase/schemas/announcements';
import CreateAnnouncementDialogForm from './-actions/create';
import DeleteAnnouncementDialogForm from './-actions/delete';
import EditAnnouncementDialogForm from './-actions/update';
import LoadingComponent from './-loading';
import { columns } from './-table';

export const Route = createFileRoute('/dashboard/announcements/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(searchParams(announcementSchema.keyof())),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) =>
    context.queryClient.fetchQuery(
      listAnnouncementsQuery(context.search.page, context.search.perPage),
    ),
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const searchQuery = Route.useSearch();
  const announcements = Route.useLoaderData();
  return (
    <article>
      <section className="py-2.5">
        <h1 className="text-2xl font-bold">Announcements</h1>
      </section>
      <section className='flex justify-between py-2.5'>
        <Button
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, new: true }) })
          }
        >
          Create Announcement
        </Button>
        <div className='flex gap-2.5'>
          <Button disabled={searchQuery.page === 1} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page - 1 }) })}>
            Prev
          </Button>
          <Button disabled={searchQuery.page >= announcements.totalPages} onClick={() => navigate({ search: (prev) => ({ ...prev, page: searchQuery.page + 1 }) })}>
            Next
          </Button>
        </div>
      </section>
      <section>
        <DataTable columns={columns} data={announcements} />
      </section>
      <section>
        <CreateAnnouncementDialogForm />
        <DeleteAnnouncementDialogForm />
        <EditAnnouncementDialogForm />
      </section>
    </article>
  );
}
