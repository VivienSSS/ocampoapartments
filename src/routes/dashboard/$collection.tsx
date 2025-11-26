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
import { ButtonGroup } from '@/components/ui/button-group';
import { ArrowLeftIcon, ArrowRightIcon, Plus } from 'lucide-react';

export const Route = createFileRoute('/dashboard/$collection')({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      page: z.number().min(1).catch(1),
      perPage: z.number().min(5).max(5).catch(5),
      action: z.string().optional(),
      id: z.string().optional(),
      options: z
        .object({
          expand: z.string().optional(),
          filter: z.string().optional(),
          sort: z.string().optional(),
        })
        .optional(),
      selected: z.array(z.string()).optional(),
    }),
  ),
  beforeLoad: async (routeContext) => {
    return { search: routeContext.search };
  },
  loader: async ({ params, context }) => {
    // get table definition
    const { search } = context;

    const response = await context.pocketbase
      .collection(params.collection)
      .getList(search.page, search.perPage, {
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
  const searchQuery = Route.useSearch();
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
        <ButtonGroup>
          <Button
            disabled={searchQuery.page === 1}
            onClick={() => {
              navigate({
                search: (prev) => ({ ...prev, page: searchQuery.page - 1 }),
              });
            }}
            variant={'outline'}
          >
            <ArrowLeftIcon />
          </Button>
          <Button
            disabled={
              searchQuery.page >=
              Math.ceil(data.totalItems / searchQuery.perPage)
            }
            onClick={() => {
              navigate({
                search: (prev) => ({ ...prev, page: searchQuery.page + 1 }),
              });
            }}
            variant={'outline'}
          >
            <ArrowRightIcon />
          </Button>
        </ButtonGroup>
      </section>
      <DataTable data={data.items} columns={columns} navigate={navigate} />
      <section className="flex justify-end gap-2.5">
        <Button
          disabled={!searchQuery.selected || searchQuery.selected.length === 0}
          variant={'destructive'}
          size={'sm'}
          onClick={() => {
            navigate({ search: (prev) => ({ ...prev, action: 'delete' }) });
          }}
        >
          Delete
        </Button>
        <Button
          disabled={searchQuery.selected?.length !== 1}
          size={'sm'}
          onClick={() => {
            navigate({ search: (prev) => ({ ...prev, action: 'update' }) });
          }}
        >
          Edit
        </Button>
        <Button
          size={'sm'}
          onClick={() => {
            navigate({ search: (prev) => ({ ...prev, action: 'create' }) });
          }}
        >
          <Plus />
          Add
        </Button>
      </section>
      <PocketbaseForms />
    </article>
  );
}
