import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { AnnouncementsResponse } from '@/pocketbase/queries/announcements';

export const columns: ColumnDef<AnnouncementsResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/announcements' });
      const searchQuery = useSearch({ from: '/dashboard/announcements/' });
      return (
        <Checkbox
          checked={
            searchQuery.selected.length ===
            table.getRowModel().rows.map((row) => row.original.id).length
          }
          onCheckedChange={(checked) => {
            if (checked) {
              navigate({
                search: (prev) => ({
                  ...prev,
                  selected: table
                    .getRowModel()
                    .rows.map((row) => row.original.id),
                }),
              });
            } else {
              navigate({
                search: (prev) => ({
                  ...prev,
                  selected: [],
                }),
              });
            }
          }}
        />
      );
    },
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/announcements' });
      const searchQuery = useSearch({ from: '/dashboard/announcements/' });

      return (
        <div className="flex justify-center">
          <Checkbox
            checked={searchQuery.selected?.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                searchQuery.selected.push(row.original.id);
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected,
                  }),
                });
              } else {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    selected: searchQuery.selected.filter(
                      (id: string) => id !== row.original.id,
                    ),
                  }),
                });
              }
            }}
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'title',
    enableSorting: false,
    header: ({ column }) => <TableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: 'message',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Message" />
    ),
    cell: ({ row }) => (
      <div className="truncate w-32">{row.getValue('message')}</div>
    ),
  },
  {
    accessorKey: 'author',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Author" />
    ),
    cell: ({ row }) => row.original.expand.author.email,
  },
  {
    accessorKey: 'created',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('created')), 'PPP'),
  },
  {
    accessorKey: 'updated',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('updated')), 'PPP'),
  },
];
