import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/ui/data-table';
import PocketbaseForms from '@/pocketbase/forms';
import { schemaToColumnDef } from '@/pocketbase/utils/table';
import { createFileRoute } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { zodValidator } from '@tanstack/zod-adapter';
import type { RecordListOptions } from 'pocketbase';
import z from 'zod';

export const Route = createFileRoute('/dashboard/$collection')({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      page: z.number().min(1).catch(1),
      perPage: z.number().min(10).max(20).catch(10),
      action: z.string().optional(),
      id: z.string().optional(),
      options: z
        .object({
          expand: z.string().optional(),
          filter: z.string().optional(),
          sort: z.string().optional(),
        })
        .optional(),
    }),
  ),
  beforeLoad: async (routeContext) => {
    return { search: routeContext.search };
  },
  loader: async ({ params, context }) => {
    // get table definition
    const { search } = context;

    const { options }: { options: RecordListOptions } = await import(
      `@/pocketbase/tables/${params.collection}`
    );

    const response = await context.pocketbase
      .collection(params.collection)
      .getList(search.page, search.perPage, {
        ...options,
        ...search.options,
      });

    const { columns, table } = schemaToColumnDef(params.collection);

    return {
      columns,
      data: response,
      table,
    };
  },
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { columns, data, table } = Route.useLoaderData();

  return (
    <article className="grid grid-cols-full gap-5">
      {/* 
        todolist:
          - pagination - check
          - sorting
          - filtering - check
          - actions (create, edit, delete, view)
      */}
      <section className="flex gap-2.5 items-center">
        <Input
          defaultValue={''}
          onChange={(event) => {
            navigate({
              search: (prev) => ({
                ...prev,
                options: {
                  filter: table?.fields
                    .map((col) => `${col.name} ~ '${event.target.value}'`)
                    .join(' || '),
                },
              }),
            });
          }}
          placeholder="Search..."
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'outline'}>Sort By</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    options: { sort: '-created' },
                  }),
                });
              }}
            >
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    options: { sort: '+created' },
                  }),
                });
              }}
            >
              Oldest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>
      <DataTable data={data.items} columns={columns} />
      <PocketbaseForms />
    </article>
  );
}
