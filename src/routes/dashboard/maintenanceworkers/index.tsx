import { createFileRoute } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import z from 'zod';
import DataTable from '@/components/ui/kibo-ui/table/data-table';
import { pb } from '@/pocketbase';
import { Collections } from '@/pocketbase/types';

import LoadingComponent from './-loading';
import { columns } from './-table';
import { searchParams } from '@/lib/utils';
import { maintenanceWorkerSchema } from '@/pocketbase/schemas/maintenanceWorkers';
import { listMaintenanceWorkersQuery } from '@/pocketbase/queries/maintenanceWorkers';
import { Button } from '@/components/ui/button';
import CreateWorkerDialogForm from './-actions/create';
import EditWorkerDialogForm from './-actions/update';

export const Route = createFileRoute('/dashboard/maintenanceworkers/')({
  component: RouteComponent,
  pendingComponent: LoadingComponent,
  validateSearch: zodValidator(
    searchParams(maintenanceWorkerSchema.keyof())
  ),
  beforeLoad: ({ search }) => ({ search }),
  loader: ({ context }) => context.queryClient.fetchQuery(listMaintenanceWorkersQuery(context.search.page, context.search.perPage))
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const announcements = Route.useLoaderData();
  return (
    <article>
      <section></section>
      <section>
        <Button onClick={() => navigate({ search: (prev) => ({ ...prev, new: true }) })}>Create Worker</Button>
      </section>
      <section>
        <DataTable columns={columns} data={announcements} />
      </section>
      <section>
        <CreateWorkerDialogForm />
        <EditWorkerDialogForm />
      </section>
    </article>
  );
}
