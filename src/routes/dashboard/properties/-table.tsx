import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { PropertiesResponse } from '@/pocketbase/types';

export const columns: ColumnDef<PropertiesResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/properties' });
      const searchQuery = useSearch({ from: '/dashboard/properties/' });
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
                  selected: table.getRowModel().rows.map((row) => row.original.id),
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
      const navigate = useNavigate({ from: '/dashboard/properties' });
      const searchQuery = useSearch({ from: '/dashboard/properties/' });

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
                      (id: string) => id !== row.original.id
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
    accessorKey: 'branch',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Branch" />
    ),
    cell: ({ row }) => <Badge className='bg-[#928c6f]'>{row.getValue('branch')}</Badge>,
  },
  {
    accessorKey: 'address',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('address')}</div>
    ),
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
