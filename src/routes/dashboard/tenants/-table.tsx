import { useNavigate, useSearch } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TableColumnHeader } from '@/components/ui/kibo-ui/table';
import type { TenantsResponse } from '@/pocketbase/queries/tenants';

export const columns: ColumnDef<TenantsResponse>[] = [
  {
    id: 'select',
    header: ({ table }) => {
      const navigate = useNavigate({ from: '/dashboard/tenants' });
      const searchQuery = useSearch({ from: '/dashboard/tenants/' });
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
      const navigate = useNavigate({ from: '/dashboard/tenants' });
      const searchQuery = useSearch({ from: '/dashboard/tenants/' });

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
    accessorKey: 'name',
    enableSorting: false,
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
    cell: ({ row }) =>
      `${row.original.expand.user.firstName} ${row.original.expand.user.lastName}`,
  },
  {
    accessorKey: 'email',
    enableSorting: false,
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => row.original.expand.user.contactEmail,
  },
  {
    accessorKey: 'facebookName',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Facebook Name" />
    ),
  },
  {
    accessorKey: 'phoneNumber',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: 'status',
    enableSorting: false,
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <Badge
        variant={row.original.expand.user.isActive ? 'default' : 'secondary'}
      >
        {row.original.expand.user.isActive ? 'Active' : 'Inactive'}
      </Badge>
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
