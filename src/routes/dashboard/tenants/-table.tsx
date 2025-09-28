import { useNavigate } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    accessorKey: 'name',
    header: ({ column }) => <TableColumnHeader column={column} title="Name" />,
    cell: ({ row }) =>
      `${row.original.expand.user.firstName} ${row.original.expand.user.lastName}`,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <TableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => row.original.expand.user.contactEmail,
  },
  {
    accessorKey: 'facebookName',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Facebook Name" />
    ),
  },
  {
    accessorKey: 'phoneNumber',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Phone Number" />
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <TableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <Badge variant={row.original.expand.user.isActive ? 'default' : 'secondary'}>
        {row.original.expand.user.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  {
    accessorKey: 'created',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('created')), 'PPP'),
  },
  {
    accessorKey: 'updated',
    header: ({ column }) => (
      <TableColumnHeader column={column} title="Updated" />
    ),
    cell: ({ row }) => format(new Date(row.getValue('updated')), 'PPP'),
  },
  {
    header: 'Actions',
    cell: ({ row }) => {
      const navigate = useNavigate({ from: '/dashboard/tenants' });

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size={'icon'}>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    id: row.original.id,
                    edit: true,
                  }),
                })
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    id: row.original.id,
                    delete: true,
                  }),
                })
              }
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
